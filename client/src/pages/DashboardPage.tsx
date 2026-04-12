import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const DashboardPage = () => {

  const user = useAuth().user

  if (!user) {
    return(
      <div>
        Dashboard Page
        <Link to="/login">Login</Link>
      </div>
    )
  }

  return (
    <div>{user.username}'s Dashboard</div>
  )
}

export default DashboardPage