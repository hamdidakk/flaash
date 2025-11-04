import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Mail, MoreVertical } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
}

interface UsersTableProps {
  users: User[]
  translations: {
    user: string
    role: string
    status: string
    actions: string
  }
}

export function UsersTable({ users, translations }: UsersTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">{translations.user}</th>
              <th className="px-4 py-3 text-left text-sm font-medium">{translations.role}</th>
              <th className="px-4 py-3 text-left text-sm font-medium">{translations.status}</th>
              <th className="px-4 py-3 text-right text-sm font-medium">{translations.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{user.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.status === "active" ? "default" : "outline"}>{user.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
