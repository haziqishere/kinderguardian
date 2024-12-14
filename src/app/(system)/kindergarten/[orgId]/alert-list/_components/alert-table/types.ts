export type ParentAction = "Responded" | "No Response"
export type AlertStatus = "Messaged" | "Called"

export type AlertStudent = {
  id: string
  name: string
  class: string
  attendancePerformance: string
  parentAction: ParentAction
  alertStatus: AlertStatus
  reason?: string
}
