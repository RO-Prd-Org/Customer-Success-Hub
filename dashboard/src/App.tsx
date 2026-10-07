import { MasterLayout } from "@/components/patterns/master-layout"
import { ExecutiveDashboardPage } from "@/views/executive/executive-dashboard-page"

export function App() {
  return (
    <MasterLayout chatbotOpen={false} defaultChatbotOpen={false}>
      <MasterLayout.Main>
        <ExecutiveDashboardPage />
      </MasterLayout.Main>
    </MasterLayout>
  )
}

export default App
