import Link from "next/link";

export default function dashboardPage() {
    return (
        <>
            <div className="flex flex-col space-y-4 items-center justify-center min-h-screen bg-gray-200">
                <p>Dashboard</p>
                <Link href={"/newRequest"}>
                    <button className="bg-white text-black p-1">New Request</button>
                </Link>
                <Link href={"/viewRequest"}>
                    <button className="bg-white text-black p-1">View Requests</button>
                </Link>
                <Link href={"/accountInfo"}>
                    <button className="bg-white text-black p-1">Account</button>
                </Link>
                <Link href={"/auditLog"}>
                    <button className="bg-white text-black p-1">Audit Log</button>
                </Link>
            </div>
        </>
    );
}