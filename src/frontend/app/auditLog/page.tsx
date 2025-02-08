import Link from "next/link";

export default function AuditLogPage() {
   return (
      <>
         <div className="flex flex-col space-y-4 items-center justify-center min-h-screen bg-gray-200">
            <p>Audit Log</p>
            <Link href={"/dashboard"}>
               <button className="bg-white text-black p-1">Dashboard</button>
            </Link>
         </div>
      </>
   );
}
