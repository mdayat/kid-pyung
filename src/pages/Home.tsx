import withAuth from "../hoc/withAuth";

function Home(): JSX.Element {
  return (
    <>
      <div>
        <h1 className="font-bold text-center text-2xl mt-6">Selamat Datang!</h1>
      </div>
    </>
  );
}

const AuthenticatedHome = withAuth(Home);
AuthenticatedHome.displayName = "Home";
export default AuthenticatedHome;
