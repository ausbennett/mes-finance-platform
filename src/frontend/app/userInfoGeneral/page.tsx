import Link from "next/link";

export default function UserInfoGeneralPage() {
    return (
        <>
            <div className="flex flex-col space-y-4 items-center justify-center min-h-screen bg-gray-200">
                <p>User Info (General) Page</p>
                <Link href={"/userInfoClub"}>
                    <button className="bg-white text-black p-1">Continue</button>
                </Link>
            </div>
        </>
    );
}