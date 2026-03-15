import React from 'react';

const FormGroup = ({ children, label, required }) => {
  return (
    <div className="form-group">
      {label && <label>{label}{required && ' *'}</label>}
      {children}
    </div>
  );
};

export default FormGroup;