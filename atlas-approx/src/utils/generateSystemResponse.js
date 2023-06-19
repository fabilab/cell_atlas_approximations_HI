
const generateSystemResponse = async (userMessage, context) => {
    try {
      const response = await window.ask(userMessage, context);
      return response; // return the response object if successful
    } catch (error) {
      return null; // return null in case of an error
    }
  };
  
export default generateSystemResponse;
  