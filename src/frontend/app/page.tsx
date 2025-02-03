import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div className="flex flex-col space-y-4 items-center justify-center min-h-screen bg-gray-200">
        <p>Login Page</p>
        <Link href={"/userInfoGeneral"}>
          <button className="bg-white text-black p-1">Login</button>
        </Link>
      </div>
    </>
  );
}