import Link from "next/link";

export default function ViewRequestsPage() {
    return (
        <>
            <div className="flex flex-col space-y-4 items-center justify-center min-h-screen bg-gray-200">
                <p>View Requests Page</p>
                <Link href={"/dashboard"}>
                    <button className="bg-white text-black p-1">Dashboard</button>
                </Link>

            </div>
        </>
    );
}