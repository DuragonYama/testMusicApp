export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Spotify</div>
      <nav className="sidebar-nav">
        <div className="nav-item active">
          <span>Home</span>
        </div>
        <div className="nav-item">
          <span>Search</span>
        </div>
        <div className="nav-item">
          <span>Your Library</span>
        </div>
      </nav>
    </aside>
  );
};
