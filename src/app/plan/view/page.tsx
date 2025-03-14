'use client'
import withAuth from '@/app/hoc/withAuth'
import PlanViewer from '@/components/PlanViewer'

function PlanView() {

  return (
    <PlanViewer readonly={false} />
  )
}

export default withAuth(PlanView)
