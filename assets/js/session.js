// session.js
async function initializeUserSession(mobnumber) {
  return new Promise((resolve, reject) => {
    const payload = {
      action: "login",
      function_name: "im_user_login_fn",
      params: {
        mobnumber: parseInt(mobnumber, 10),
      },
    };

    const apiUrl = `${BASE_API_URL}/commonfunction`;

    $.ajax({
      url: apiUrl,
      method: "POST",
      headers: {
        "X-APP-Key": "edm",
        "X-APP-Name": "edm",
      },
      data: { data: encryptData(payload) },
      dataType: "json",
      cache: false,
      success: function (response) {
        try {
          if (!response?.data) throw new Error("Invalid response format");

          const decryptedResponse = decryptData(response.data);
          if (!Array.isArray(decryptedResponse) || !decryptedResponse.length)
            throw new Error("Empty user data");

          // const user = decryptedResponse[0];

          // const userSession = {
          //   name: user.name || "",
          //   role: user.login_type || "",
          //   district: user.district || "",
          //   designation: user.designation || "",
          //   system: user.system || "",
          //   institutionName: user.name_of_the_institution || "",
          //   mobnumber: mobnumber,
          // };

          const rawString = decryptedResponse[0]?.im_user_login_fn;
          if (!rawString) throw new Error("Invalid nested data");

          // 🔥 Fix: convert &quot; → "
          const decoded = rawString.replace(/&quot;/g, '"');

          // 🔥 Parse JSON safely
          const user = JSON.parse(decoded);

          const userSession = {
            id: user.id || "",
            status: user.status || false,
            name: user.name_of_the_indenting_officer || "", // Correct field
            role: user.login_type || "",
            system: user.system || "",
            district: user.district || "",
            designation: user.designation_of_officer || "",
            institutionName: user.name_of_the_institution || "",
            email: user.e_mail_id || "",
            institutionType: user.institution_type || "",
            mobnumber: mobnumber,
          };


          const encryptedSession = encryptData(userSession);
          sessionStorage.setItem("encryptedUserSession", encryptedSession);
          sessionStorage.setItem("loginTime", Date.now().toString());
          sessionStorage.setItem("usermobnumberNumber", String(mobnumber));

          console.log("✅ Session initialized successfully:", userSession);
          resolve(userSession);
        } catch (err) {
          console.error("Session initialization error:", err);
          reject(err);
        }
      },
      error: function (xhr) {
        console.error("API call failed:", xhr.responseText);
        reject(new Error("API call failed"));
      },
    });
  });
}

// 🔓 Global helper to access decrypted session
function getDecryptedUserSession() {
  try {
    const encryptedSession = sessionStorage.getItem("encryptedUserSession");
    if (!encryptedSession) return null;
    return decryptData(encryptedSession);
  } catch (err) {
    console.error("Error decrypting session:", err);
    return null;
  }
}

window.initializeUserSession = initializeUserSession;
window.getDecryptedUserSession = getDecryptedUserSession;


// 🌐 Global AJAX interceptor for Unauthorized handling
$(document).ajaxComplete(function (event, xhr, settings) {
  try {
    const contentType = xhr.getResponseHeader("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const response = JSON.parse(xhr.responseText);

      // Check for unauthorized message or 401 response
      if (
        xhr.status === 401 ||
        response?.message?.toLowerCase().includes("unauthorized")
      ) {
        console.warn("⚠️ Unauthorized response detected. Logging out...");
        handleLogout();
      }
    }
  } catch (err) {
    console.error("Error checking AJAX response:", err);
  }
});
