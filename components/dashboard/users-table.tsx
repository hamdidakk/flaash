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
    <Card className="dashboard-card">
      <div className="dashboard-table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr className="dashboard-table__head-row">
              <th className="dashboard-table__cell--dense">{translations.user}</th>
              <th className="dashboard-table__cell--dense">{translations.role}</th>
              <th className="dashboard-table__cell--dense">{translations.status}</th>
              <th className="dashboard-table__cell--dense dashboard-table__cell--right">{translations.actions}</th>
            </tr>
          </thead>
          <tbody className="dashboard-table__body">
            {users.map((user) => (
              <tr key={user.id} className="dashboard-table__row">
                <td className="dashboard-table__cell--dense">
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
                <td className="dashboard-table__cell--dense">
                  <Badge variant="secondary">{user.role}</Badge>
                </td>
                <td className="dashboard-table__cell--dense">
                  <Badge variant={user.status === "active" ? "default" : "outline"}>{user.status}</Badge>
                </td>
                <td className="dashboard-table__cell--dense">
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
