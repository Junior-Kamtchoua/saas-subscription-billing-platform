"use client";

import { useEffect, useState } from "react";

type UserRow = {
  id: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  created_at: string;
  subscription_status: string | null;
  plan_name: string | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [loading, setLoading] = useState(true);

  /*Debounce search*/
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /*Fetch users*/
  useEffect(() => {
    async function loadUsers() {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        q: debouncedSearch,
      });

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setUsers(data.users ?? []);
        setTotalPages(data.totalPages ?? 1);
      }

      setLoading(false);
    }

    loadUsers();
  }, [page, debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="mt-1 text-sm text-gray-600">
          Search and review all registered users by email.
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-md border px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-sm text-gray-500">Loading users…</p>
      )}

      {/* Empty state */}
      {!loading && users.length === 0 && (
        <div className="rounded-lg border border-dashed bg-white p-10 text-center">
          <p className="text-lg font-medium text-gray-900">No users found</p>
          <p className="mt-2 text-sm text-gray-600">
            {debouncedSearch
              ? `No users match “${debouncedSearch}”.`
              : "There are no users in the system yet."}
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && users.length > 0 && (
        <>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left text-gray-700">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Subscription</th>
                  <th className="px-4 py-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{u.email}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {u.plan_name ?? <span className="text-gray-400">—</span>}
                    </td>

                    <td className="px-4 py-3">
                      {u.subscription_status ? (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          NONE
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border px-4 py-2 text-sm font-medium
                         cursor-pointer transition hover:bg-gray-100
                         disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-md border px-4 py-2 text-sm font-medium
                         cursor-pointer transition hover:bg-gray-100
                         disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
