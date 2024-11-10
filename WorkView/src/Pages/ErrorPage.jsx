import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  return (
    <>
      <div>
        <h1>Oops! Error Occured</h1>
      </div>
      <div>
        <p>{error.statusText || error.messageText}</p>
      </div>
    </>
  );
}
