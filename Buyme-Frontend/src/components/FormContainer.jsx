const FormContainer = ({ children }) => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
          {children}
        </div>
      </div>
    );
  };
  
  export default FormContainer;
  