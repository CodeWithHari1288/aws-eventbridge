export const handler = async (event: any) => {
         
    console.log("Event Bridge AWS Pipes Learning : ", JSON.stringify(event));

    return {
            statusCode: 200,
            body: "From Event Pipes.............."
      } ;
};

