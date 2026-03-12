-- #*#*#*#*#*#**#*#*#*#*#*#*#**#*#*#*#*#**#*#**#		ADMIN		#*#*#*#*#**#*#*#*#*#*#*#**#*#*#*#*#*#**#*#*#*#*#**#
-- User Details
CREATE   FUNCTION public.im_get_user_details_fn(
	)
    RETURNS TABLE(id bigint, district varchar, login_type varchar, name_of_the_institution varchar, institution_type varchar, system varchar, 
	name_of_the_indenting_officer varchar, designation_of_officer varchar, aadhaar_number bigint, aadhaar_linked_mobile_no bigint, 
	e_mail_id varchar, created_by varchar, created_date date, updated_by varchar, updated_date date, status char) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT * FROM IM_USER_LOGIN ORDER BY UPDATED_DATE DESC;
END;
$BODY$;

-- When clik on Edit button , it move to another form page to Edit
--completed
CREATE function public.im_upd_user_login_fn(
	IN p_id integer,
	IN p_district varchar,
	IN p_system varchar,
	IN p_login_type varchar,
	IN p_e_mail_id varchar,
	IN p_name_of_the_institution varchar,
	IN p_institution_type varchar,
	IN p_name_of_the_indenting_officer varchar,
	IN p_designation_of_officer varchar,
	IN p_aadhaar_linked_mobile_no bigint,
	IN p_updated_by varchar,
	IN p_updated_date date)
	RETURNS VOID
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    UPDATE IM_USER_LOGIN
    SET DISTRICT = p_district,
        SYSTEM = p_system,
        LOGIN_TYPE = p_login_type,
        E_MAIL_ID = p_e_mail_id,
        NAME_OF_THE_INSTITUTION = p_name_of_the_institution,
        INSTITUTION_TYPE = p_institution_type,
        NAME_OF_THE_INDENTING_OFFICER = p_name_of_the_indenting_officer,
        DESIGNATION_OF_OFFICER = p_designation_of_officer,
        AADHAAR_LINKED_MOBILE_NO = p_aadhaar_linked_mobile_no,
        UPDATED_BY = p_updated_by,
        UPDATED_DATE = p_updated_date
    WHERE ID = p_id;
END;
$BODY$;

-- When click on Create button Running below query:
--completed
CREATE FUNCTION public.im_ins_user_login_fn(
	IN p_district varchar,
	IN p_system varchar,
	IN p_login_type varchar,
	IN p_e_mail_id varchar,
	IN p_name_of_the_institution varchar,
	IN p_institution_type varchar,
	IN p_name_of_the_indenting_officer varchar,
	IN p_designation_of_officer varchar,
	IN p_aadhaar_linked_mobile_no bigint,
	IN p_created_by varchar,
	IN p_created_date date)
	RETURNS VOID
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    INSERT INTO IM_USER_LOGIN (
        DISTRICT, SYSTEM, LOGIN_TYPE, E_MAIL_ID,
        NAME_OF_THE_INSTITUTION, INSTITUTION_TYPE,
        NAME_OF_THE_INDENTING_OFFICER, DESIGNATION_OF_OFFICER,
        AADHAAR_LINKED_MOBILE_NO, CREATED_BY, CREATED_DATE
    )
    VALUES (
        p_district, p_system, p_login_type, p_e_mail_id,
        p_name_of_the_institution, p_institution_type,
        p_name_of_the_indenting_officer, p_designation_of_officer,
        p_aadhaar_linked_mobile_no, p_created_by, p_created_date
    );
END;
$BODY$;


--Medicine Details Report
--completed
CREATE FUNCTION im_get_med_det_fn()
RETURNS TABLE (
    id bigint,
    system varchar,
    medicine_by varchar,
    name_of_the_medicine varchar,
    packing_size varchar,
    price double precision,
    created_by varchar,
    created_date timestamp with time zone,
    updated_by varchar,
    updated_date timestamp with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM IM_MEDICINE;
END;
$$ LANGUAGE plpgsql;


-- When click on Create button run Below query:  
--completed
CREATE FUNCTION public.im_ins_medicine_fn(
	p_system varchar,
	p_medicine_by varchar,
	p_name_of_the_medicine varchar,
	p_packing_size varchar,
	p_price numeric,
	p_created_by varchar,
	p_created_date timestamp with time zone)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    INSERT INTO IM_MEDICINE(
        SYSTEM, MEDICINE_BY, NAME_OF_THE_MEDICINE, PACKING_SIZE, PRICE, CREATED_BY, CREATED_DATE)
    VALUES (
        p_system, p_medicine_by, p_name_of_the_medicine, p_packing_size, p_price, p_created_by, p_created_date);
END;
$BODY$;

-- When click on Edit button run Below query:
--completed
CREATE function public.im_update_medicine_fn(
	IN p_id integer,
	IN p_system varchar,
	IN p_medicine_by varchar,
	IN p_name_of_the_medicine varchar,
	IN p_packing_size varchar,
	IN p_price numeric,
	IN p_updated_by varchar,
	IN p_updated_date timestamp with time zone)
	RETURNS VOID
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    UPDATE IM_MEDICINE
    SET SYSTEM = p_system,
        MEDICINE_BY = p_medicine_by,
        NAME_OF_THE_MEDICINE = p_name_of_the_medicine,
        PACKING_SIZE = p_packing_size,
        PRICE = p_price,
        UPDATED_BY = p_updated_by,
        UPDATED_DATE = p_updated_date
    WHERE ID = p_id;
END;
$BODY$;



-- Desease Details:
CREATE FUNCTION im_get_disease_details_fn()
RETURNS TABLE (
    id bigint,
    system varchar,
    name_of_the_disease varchar,
    created_by varchar,
    created_date TIMESTAMP with time zone,
    updated_by varchar,
    updated_date TIMESTAMP with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM IM_DISEASE;
END;
$$ LANGUAGE plpgsql;

-- When Click on Create button
--completed
CREATE function public.im_insert_disease_fn(
	IN p_system varchar,
	IN p_name_of_the_disease varchar,
	IN p_created_by varchar,
	IN p_created_date timestamp with time zone)
	returns void
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    INSERT INTO IM_DISEASE(SYSTEM, NAME_OF_THE_DISEASE, CREATED_BY, CREATED_DATE)
    VALUES (p_system, p_name_of_the_disease, p_created_by, p_created_date);
END;
$BODY$;


-- When Click on Edit Button
--completed
CREATE function public.im_update_disease_fn(
	IN p_id integer,
	IN p_system varchar,
	IN p_name_of_the_disease varchar,
	IN p_updated_by varchar,
	IN p_updated_date timestamp with time zone)
	RETURNS VOID
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    UPDATE IM_DISEASE
    SET SYSTEM = p_system,
        NAME_OF_THE_DISEASE = p_name_of_the_disease,
        UPDATED_BY = p_updated_by,
        UPDATED_DATE = p_updated_date
    WHERE ID = p_id;
END;
$BODY$;

--Budget Details - Regular:
 CREATE FUNCTION im_get_im_allotted_budget_fn()
RETURNS TABLE(
    id bigint,
    s_no bigint,
    district varchar,
    name_of_the_institution varchar,
    institution_type varchar,
    system varchar,
    regular NUMERIC,
    created_by varchar,
    created_date TIMESTAMP with time zone,
    updated_by varchar,
    updated_date TIMESTAMP with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM IM_ALLOTTED_BUDGET ORDER BY S_NO ASC;
END;
$$ LANGUAGE plpgsql;


-- When click on Create Button:
--completed
CREATE function public.im_insert_im_allotted_budget_fn(
	IN p_district varchar,
	IN p_name_of_the_institution varchar,
	IN p_institution_type varchar,
	IN p_system varchar,
	IN p_regular numeric,
	IN p_created_by varchar,
	IN p_created_date timestamp with time zone)
	RETURNS VOID
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    INSERT INTO IM_ALLOTTED_BUDGET(
        DISTRICT,
        NAME_OF_THE_INSTITUTION,
        INSTITUTION_TYPE,
        SYSTEM,
        REGULAR,
        CREATED_BY,
        CREATED_DATE
    ) VALUES (
        p_district,
        p_name_of_the_institution,
        p_institution_type,
        p_system,
        p_regular,
        p_created_by,
        p_created_date
    );
END;
$BODY$;


-- When Click on Edit Button:
--completed
CREATE function public.im_update_im_allotted_budget_fn(
	IN p_id bigint,
	IN p_district varchar,
	IN p_name_of_the_institution varchar,
	IN p_institution_type varchar,
	IN p_system varchar,
	IN p_regular numeric,
	IN p_updated_by varchar,
	IN p_updated_date timestamp with time zone)
	RETURNS VOID
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    UPDATE IM_ALLOTTED_BUDGET
    SET 
        DISTRICT = p_district,
        NAME_OF_THE_INSTITUTION = p_name_of_the_institution,
        INSTITUTION_TYPE = p_institution_type,
        SYSTEM = p_system,
        REGULAR = p_regular,
        UPDATED_BY = p_updated_by,
        UPDATED_DATE = p_updated_date
    WHERE ID = p_id;
END;
$BODY$;

-- Budget Details - Scheme:
CREATE FUNCTION im_get_allotted_budget_scheme_fn()
RETURNS TABLE(
    id bigint,
    s_no bigint,
    district varchar,
    name_of_the_institution varchar,
    institution_type varchar,
    system varchar,
    scheme_name varchar,
    scheme_values numeric,
    status varchar,
    created_by varchar,
    created_date date,
    updated_by varchar,
    updated_date date
) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM ALLOTTED_BUDGET_SCHEME ORDER BY S_NO ASC;
END;
$$ LANGUAGE plpgsql;



-- When Click on Create button run below query:
--completed
CREATE FUNCTION public.im_ins_allotted_budget_scheme_fn(
	IN p_district varchar,
	IN p_name_of_the_institution varchar,
	IN p_institution_type varchar,
	IN p_system varchar,
	IN p_scheme_name varchar,
	IN p_scheme_values numeric,
	IN p_status varchar,
	IN p_created_by varchar,
	IN p_created_date date)
	RETURNS VOID
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    INSERT INTO ALLOTTED_BUDGET_SCHEME (
        DISTRICT, 
        NAME_OF_THE_INSTITUTION, 
        INSTITUTION_TYPE, 
        SYSTEM, 
        SCHEME_NAME, 
        SCHEME_VALUES, 
        STATUS, 
        CREATED_BY, 
        CREATED_DATE
    ) VALUES (
        p_district,
        p_name_of_the_institution,
        p_institution_type,
        p_system,
        p_scheme_name,
        p_scheme_values,
        p_status,
        p_created_by,
        p_created_date
    );
END;
$BODY$;

-- When Click on Edit button run below query:
--completed
CREATE function public.im_upd_allotted_budget_scheme_fn(
	IN p_id bigint,
	IN p_district varchar,
	IN p_name_of_the_institution varchar,
	IN p_institution_type varchar,
	IN p_system varchar,
	IN p_scheme_name varchar,
	IN p_scheme_values numeric,
	IN p_status varchar,
	IN p_updated_by varchar,
	IN p_updated_date date)
	RETURNS VOID
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    UPDATE ALLOTTED_BUDGET_SCHEME
    SET 
        DISTRICT = p_district,
        NAME_OF_THE_INSTITUTION = p_name_of_the_institution,
        INSTITUTION_TYPE = p_institution_type,
        SYSTEM = p_system,
        SCHEME_NAME = p_scheme_name,
        SCHEME_VALUES = p_scheme_values,
        STATUS = p_status,
        UPDATED_BY = p_updated_by,
        UPDATED_DATE = p_updated_date
    WHERE ID = p_id;
END;
$BODY$;



-- Scheme Details:
CREATE or replace FUNCTION im_get_im_scheme_details_fn()
RETURNS TABLE(
    sno bigint,
    scheme_name varchar,
    created_by varchar,
    created_date TIMESTAMP with time zone,
    updated_by varchar,
    updated_date TIMESTAMP with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM IM_SCHEME_DETAILS;
END;
$$ LANGUAGE plpgsql;


-- When Click on Create button run below query:
--completed
CREATE FUNCTION public.im_ins_im_scheme_details_fn(
	IN p_scheme_name varchar,
	IN p_created_by varchar,
	IN p_created_date timestamp with time zone)
	RETURNS VOID
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    INSERT INTO IM_SCHEME_DETAILS(
        SCHEME_NAME, 
        CREATED_BY, 
        CREATED_DATE
    ) VALUES (
        p_scheme_name,
        p_created_by,
        p_created_date
    );
END;
$BODY$;

-- When Click on Edit button run below query:
--completed
CREATE function public.im_upd_im_scheme_details_fn(
	IN p_sno bigint,
	IN p_scheme_name varchar,
	IN p_updated_by varchar,
	IN p_updated_date timestamp with time zone)
	RETURNS VOID
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    UPDATE IM_SCHEME_DETAILS
    SET 
        SCHEME_NAME = p_scheme_name,
        UPDATED_BY = p_updated_by,
        UPDATED_DATE = p_updated_date
    WHERE SNO = p_sno;
END;
$BODY$;