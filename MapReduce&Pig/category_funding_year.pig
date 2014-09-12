input_lines = LOAD './investment.csv' USING PigStorage(',') AS (company_permalink:chararray,company_name:chararray,company_category_code:chararray,company_country_code:chararray,company_state_code:chararray,company_region:chararray,company_city:chararray,investor_permalink:chararray,investor_name:chararray,investor_category_code:chararray,investor_country_code:chararray,investor_state_code:chararray,investor_region:chararray,investor_city:chararray,funding_round_type:chararray,funded_at:chararray,funded_month:chararray,funded_quarter:chararray,funded_year:int,raised_amount_usd:int);

name_year_amt = FOREACH input_lines GENERATE company_category_code, funded_year, raised_amount_usd;

name_year_amt_filter = FILTER name_year_amt BY funded_year > 1999 AND company_category_code != '' AND raised_amount_usd > 0;

name_year_amt_grouped = GROUP name_year_amt_filter BY (company_category_code, funded_year);

final = FOREACH name_year_amt_grouped GENERATE group AS name_year, SUM(name_year_amt_filter.raised_amount_usd);

STORE final INTO './output';