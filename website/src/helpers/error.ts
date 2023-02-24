export function handleError(error: any) {
  console.log("Error:  ", error);

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}
