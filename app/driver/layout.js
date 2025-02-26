// File: app/driver/layout.js
export default function DriverLayout({ children }) {
    return (
      <div>
        <nav>
          <a href="/driver/dashboard">Dashboard</a>
          <a href="/driver/notifications">Notifications</a>
          <a href="/driver/onboarding">Onboarding</a>
        </nav>
        <main>{children}</main>
      </div>
    );
  }
  
  