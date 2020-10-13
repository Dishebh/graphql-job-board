import React, { useState, useEffect } from 'react';
import { JobList } from './JobList';
import { loadCompany } from './requests'

export const CompanyDetail = (props) => {
  const [company, setCompany] = useState({})

  const { companyId } = props.match.params;
  
  useEffect(() => {
    loadCompany(companyId)
      .then(company => setCompany(company));
  }, [companyId])

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h5 className="title is-5">Jobs at {company.name}</h5>
        <JobList jobs={company.jobs} />
    </div>
  );
}
