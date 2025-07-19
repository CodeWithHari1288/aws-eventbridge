export const handler = async (event: any) => {
         
    console.log("Event Bridge Scheduler Learning : ", JSON.stringify(event));

    return {
            statusCode: 200,
            body: "From Event Scheduler.............."
      } ;
};

