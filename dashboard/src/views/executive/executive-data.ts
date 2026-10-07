export const pipelineByMonth = [
  { month: "Dec 25", rolling: 1 },
  { month: "Jan 26", rolling: 1 },
  { month: "Feb 26", rolling: 1 },
  { month: "Mar 26", rolling: 1 },
  { month: "Apr 26", rolling: 110001 },
  { month: "May 26", rolling: 135001 },
  { month: "Jun 26", rolling: 635001 },
  { month: "Jul 26", rolling: 635001 },
  { month: "Aug 26", rolling: 1380001 },
  { month: "Sep 26", rolling: 1580001 },
  { month: "Oct 26", rolling: 2043601 },
  { month: "Nov 26", rolling: 2783601 },
  { month: "Dec 26", rolling: 3338809 },
  { month: "Jan 27", rolling: 3473809 },
  { month: "Feb 27", rolling: 3658009 },
  { month: "Mar 27", rolling: 4253009 },
  { month: "Apr 27", rolling: 4253009 },
  { month: "May 27", rolling: 4433009 },
  { month: "Jun 27", rolling: 4593009 },
]

export type ImplementationRow = {
  customer: string
  percent: number
  stageNo: string
  stage: string
  days: string
  rag: "Complete" | "Red"
  arr: number
}

export const implementations: ImplementationRow[] = [
  { customer: "Aussie Broadband", percent: 100, stageNo: "10", stage: "Sandbox Live", days: "50", rag: "Complete", arr: 350000 },
  { customer: "Vicinity Centres", percent: 90, stageNo: "9", stage: "Released to Customer with Changes", days: "37", rag: "Red", arr: 25000 },
  { customer: "Police Credit Union SA & NT", percent: 70, stageNo: "7", stage: "Released to Customer for Testing", days: "45", rag: "Red", arr: 25000 },
  { customer: "Nutrimetics", percent: 60, stageNo: "6", stage: "Corrections from Testing", days: "34", rag: "Red", arr: 25000 },
  { customer: "YourCFOPartner", percent: 30, stageNo: "3", stage: "Configuration to Customer SoW", days: "30", rag: "Red", arr: 10000 },
  { customer: "Northern Health", percent: 40, stageNo: "4", stage: "Access - provide customer demo logins", days: "42", rag: "Red", arr: 300000 },
  { customer: "Treasury Wine Estates", percent: 30, stageNo: "3", stage: "Configuration to Customer SoW", days: "36", rag: "Red", arr: 280000 },
  { customer: "QBE Insurance", percent: 20, stageNo: "2", stage: "Configuration to base level (Simple PO flow)", days: "31", rag: "Red", arr: 60000 },
  { customer: "CoolDrive Auto Parts", percent: 50, stageNo: "5", stage: "Internal Testing", days: "53", rag: "Red", arr: 60000 },
  { customer: "ENGIE AU", percent: 10, stageNo: "1", stage: "Engineering — environment yet to be allocated", days: "44", rag: "Red", arr: 50000 },
  { customer: "Regis Aged Care", percent: 10, stageNo: "1", stage: "Engineering — environment yet to be allocated", days: "69", rag: "Red", arr: 50000 },
  { customer: "SALTA", percent: 40, stageNo: "4", stage: "Access - provide customer demo logins", days: "33", rag: "Red", arr: 50000 },
  { customer: "TOGA", percent: 20, stageNo: "2", stage: "Configuration to base level (Simple PO flow)", days: "39", rag: "Red", arr: 50000 },
  { customer: "Kane Construction", percent: 80, stageNo: "8", stage: "Customer Config Changes Being Made", days: "29", rag: "Red", arr: 30000 },
  { customer: "ISS Data", percent: 70, stageNo: "7", stage: "Released to Customer for Testing", days: "49", rag: "Red", arr: 25000 },
]
