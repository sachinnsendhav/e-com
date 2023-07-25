import React from 'react';

const EditInformationForm = () => {
  // Custom styles for input fields
  const inputStyles = {
    color: 'black', // Change the text color to blue
    backgroundColor: '#f0f0f0', // Change the background color to light gray
    borderRadius: '5px', // Add rounded corners to the input fields
    padding: '0.5rem 1rem', // Add padding to the input fields
   // Add a border to the input fields
    width: '27rem', // Set the width of the input fields to 100% of their container
    border:"0.0625rem solid #dce0e5",
    marginBottom: '1rem'
  };
  const checkboxesContainerStyles = {
    marginTop: '1rem',
    display: "block",
    fontSize:" 0.75rem",
    fontWeight: "700",
    marginBottom:" 0.4rem",
    textTransform:" uppercase",
    color:" #333"
    
  };
  const listItemStyles = {
    listStyle: 'none',
  };
  
  const styleeee = {
    color: 'black', // Change the text color to blue
    backgroundColor: '#f0f0f0', // Change the background color to light gray
    borderRadius: '5px', // Add rounded corners to the input fields
    padding: '0.5rem 1rem', // Add padding to the input fields
   // Add a border to the input fields
    width: '6rem', // Set the width of the input fields to 100% of their container
    border:"0.0625rem solid #dce0e5",
    marginBottom: '1rem'
  };
  const styleee = {
    color: 'black', // Change the text color to blue
    backgroundColor: '#f0f0f0', // Change the background color to light gray
    borderRadius: '5px', // Add rounded corners to the input fields
    padding: '0.5rem 1rem', // Add padding to the input fields
   // Add a border to the input fields
    width: '8rem', // Set the width of the input fields to 100% of their container
    border:"0.0625rem solid #dce0e5",
    marginBottom: '1rem'
  };
  const stylee = {
    color: 'black', // Change the text color to blue
    backgroundColor: '#f0f0f0', // Change the background color to light gray
    borderRadius: '5px', // Add rounded corners to the input fields
    padding: '0.5rem 1rem', // Add padding to the input fields
    
   // Add a border to the input fields
    width: '8rem', // Set the width of the input fields to 100% of their container
    border:"0.0625rem solid #dce0e5",
    marginBottom: '1rem'
  };

  // Custom styles for labels
  const labelStyles = {
    display: 'block', // Make the labels block-level elements
    fontSize: '0.75rem',
    fontWeight: '700',
    marginBottom: '0.4rem',
    textTransform: 'uppercase',
    color: '#333',
  };
  const inputContainerStyles = {
    flex: 1,
    marginRight: '3rem',
    width:"5rem"
  };

  const formContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  const rowStyles = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  };

  function SubmitHandler(e: any): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div style={formContainerStyles}>
    <form className="form">
      <fieldset>
      <legend style={{ marginBottom: '1rem' }}>Edit Information</legend>


        <div className="form__input-row">
          <label htmlFor="businessUnit" className="form__label" style={labelStyles}>
            SELECT BUSINESS UNIT:
          </label>
          <select
            id="businessUnit"
            name="businessUnit"
            className="form__input form__input--select"
            style={inputStyles}
          >
            <option value="1">Spryker Systems GmBH ID:23</option>
            <option value="2">Spryker Systems GmBH ID:24</option>
            <option value="3">Spryker Systems GmBH ID:26</option>
            <option value="4">Spryker Systems GmBH ID:27</option>
          </select>
        </div>

        <div className="form__input-row" style={checkboxesContainerStyles}>
            <label htmlFor="selectRoles" className="form__label" style={labelStyles}>
              SELECT ROLES:
            </label>
            <ul className="list list--checkbox"  style={listItemStyles}>
              <li className="list__item list__item--checkbox">
                <span className="checkbox">
                  <input type="checkbox" id="role1" name="roles[]" value="Role 1" className="checkbox__input" />
                  <span className="checkbox__box">
                   
                  </span>
                  <span style={{ marginTop: '0.5rem',
    display: "block",
    fontSize:" 0.75rem",
    fontWeight: "700",
    marginBottom:" 0.4rem",
    textTransform:"uppercase",
    color:" #333"}} className="checkbox__label">ADMIN</span>
                </span>
              </li>
              <li className="list__item list__item--checkbox">
                <span className="checkbox">
                  <input type="checkbox" id="role2" name="roles[]" value="Role 2" className="checkbox__input" />
                  <span className="checkbox__box">
                    
                  </span>
                  <span  style={{ marginTop: '0.5rem',
    display: "block",
    fontSize:" 0.75rem",
    fontWeight: "700",
    marginBottom:" 0.4rem",
    textTransform:"uppercase",
    color:" #333"}} className="checkbox__label">BUYER</span>
                </span>
              </li>
              <li className="list__item list__item--checkbox">
                <span className="checkbox">
                  <input type="checkbox" id="role2" name="roles[]" value="Role 2" className="checkbox__input" />
                  <span className="checkbox__box">
                    
                  </span>
                  <span  style={{ marginTop: '0.5rem',
    display: "block",
    fontSize:" 0.75rem",
    fontWeight: "700",
    marginBottom:" 0.4rem",
    textTransform:"uppercase",
    color:" #333"}} className="checkbox__label">APPROVER</span>
                </span>
              </li>
              <li className="list__item list__item--checkbox">
                <span className="checkbox">
                  <input type="checkbox" id="role2" name="roles[]" value="Role 2" className="checkbox__input" />
                  <span className="checkbox__box">
                    
                  </span>
                  <span  style={{ marginTop: '0.5rem',
    display: "block",
    fontSize:" 0.75rem",
    fontWeight: "700",
    marginBottom:" 0.4rem",
    textTransform:"uppercase",
    color:" #333"}} className="checkbox__label">BUYER WITH LIMIT</span>
                </span>
              </li>
          
              {/* Add more list items for each role */}
            </ul>
          </div>


        <div className="form__input-row" style={rowStyles}>
        <div style={inputContainerStyles}>
          <label className="form__label" style={labelStyles}>
            Salutation:
          </label>
          <input type="text" name="salutation" className="form__input form__input--text" style={styleeee}  />
</div>
<div style={inputContainerStyles}>
          <label className="form__label" style={labelStyles}>
            First Name:
          </label>
          <input type="text" name="firstName" className="form__input form__input--text"  style={styleee} />
</div>
<div style={inputContainerStyles}>
          <label className="form__label" style={labelStyles}>
            Last Name:
          </label>
          <input type="text" name="lastName" className="form__input form__input--text"   style={styleee}  />
          </div>
        </div>

        <label htmlFor="email" className="form__label" style={labelStyles}>
          Email:
        </label>
        <input type="email" id="email" name="email" className="form__input form__input--text" style={inputStyles} />
      </fieldset>

      <button
        type="submit"
        style={{
          width: '8rem',
          
          background: 'rgb(207, 18, 46)',
          borderRadius: '1px',
        }}
        onClick={(e: any) => SubmitHandler(e)}
        className="btn btn--rounded btn--yellow btn-submit"
      >
        Submit
      </button>

      <button
        type="button"
        style={{
          width: '8rem',
         
          background: 'white',
          borderRadius: '1px',
          border: '2px solid rgb(207, 18, 46)',
          color: 'rgb(207, 18, 46)',
          marginLeft: '12px',
        }}
        onClick={(e: any) => SubmitHandler(e)}
        className="btn btn--rounded btn--yellow btn-submit"
      >
        Cancel
      </button>
    </form>
    </div>
  );
};

export default EditInformationForm;
