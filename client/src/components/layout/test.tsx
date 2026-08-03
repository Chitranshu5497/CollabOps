<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CollabOps — Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --bg: #F5F4FC;
    --bg-2: #EFEDFB;
    --sidebar: #0B0E1B;
    --sidebar-soft: #12162A;
    --sidebar-line: rgba(255,255,255,0.07);
    --ink: #15121F;
    --muted: #6E7185;
    --muted-2: #9496A8;
    --primary: #7C5CFC;
    --primary-2: #9F7BFF;
    --cyan: #22D3EE;
    --card-bg: #FFFFFF;
    --card-border: #E9E6F7;
    --success: #2DD4A7;
    --notif: #FB5B7C;
    --shadow-sm: 0 1px 2px rgba(20,15,50,0.04);
    --shadow-md: 0 8px 24px -8px rgba(56,40,120,0.16);
    --shadow-lg: 0 24px 48px -16px rgba(56,40,120,0.28);
    --radius: 18px;
  }

  *{ box-sizing:border-box; }
  html,body{ margin:0; padding:0; }
  body{
    font-family:'Inter', sans-serif;
    background:
      radial-gradient(1100px 500px at 90% -10%, rgba(124,92,252,0.10), transparent 60%),
      radial-gradient(900px 500px at -10% 10%, rgba(34,211,238,0.08), transparent 55%),
      var(--bg);
    color: var(--ink);
    min-height: 100vh;
    overflow-x:hidden;
  }
  h1,h2,h3, .display{ font-family:'Space Grotesk', sans-serif; }
  ::selection{ background: rgba(124,92,252,0.25); }

  @media (prefers-reduced-motion: reduce){
    *{ animation-duration:0.01ms !important; animation-iteration-count:1 !important; transition-duration:0.01ms !important; }
  }

  /* ---------- Layout ---------- */
  .shell{ display:flex; min-height:100vh; }

  /* ---------- Sidebar ---------- */
  .sidebar{
    width:264px; flex-shrink:0;
    background: linear-gradient(180deg, var(--sidebar) 0%, var(--sidebar-soft) 100%);
    color:#EAEAF4;
    display:flex; flex-direction:column;
    padding:28px 18px;
    position:sticky; top:0; height:100vh;
    z-index:40;
    transition: transform .35s cubic-bezier(.4,0,.2,1);
  }
  .brand{
    display:flex; align-items:center; gap:10px;
    padding:4px 10px 30px 10px;
    font-family:'Space Grotesk', sans-serif;
    font-weight:700; font-size:21px; letter-spacing:-0.02em;
  }
  .brand-mark{
    width:34px; height:34px; border-radius:10px;
    background: linear-gradient(135deg, var(--primary), var(--cyan));
    display:flex; align-items:center; justify-content:center;
    box-shadow: 0 6px 16px -4px rgba(124,92,252,0.55);
    flex-shrink:0;
  }
  .brand-mark svg{ width:18px; height:18px; }
  .brand span.accent{ background: linear-gradient(135deg, var(--primary-2), var(--cyan)); -webkit-background-clip:text; background-clip:text; color:transparent; }

  .nav{ display:flex; flex-direction:column; gap:3px; margin-top:6px; }
  .nav-item{
    position:relative;
    display:flex; align-items:center; gap:12px;
    padding:11px 14px; border-radius:12px;
    color:#A7A9C0; text-decoration:none;
    font-size:14.5px; font-weight:500;
    cursor:pointer; user-select:none;
    transition: color .2s ease, background .2s ease;
  }
  .nav-item svg{ width:18px; height:18px; opacity:0.85; flex-shrink:0; }
  .nav-item:hover{ color:#fff; background: rgba(255,255,255,0.05); }
  .nav-item.active{ color:#fff; background: rgba(124,92,252,0.16); }
  .nav-item.active::before{
    content:''; position:absolute; left:-18px; top:50%; transform:translateY(-50%);
    width:3px; height:20px; border-radius:3px;
    background: linear-gradient(180deg, var(--primary-2), var(--cyan));
  }
  .nav-badge{
    margin-left:auto; font-family:'JetBrains Mono', monospace; font-size:11px;
    background: rgba(124,92,252,0.22); color:#C9BEFF;
    padding:2px 7px; border-radius:20px; font-weight:500;
  }
  .nav-item.active .nav-badge{ background: linear-gradient(135deg, var(--primary), var(--cyan)); color:#0B0E1B; font-weight:700; }

  .sidebar-spacer{ flex:1; }

  .sidebar-user{
    display:flex; align-items:center; gap:11px;
    padding:12px 12px; border-radius:14px;
    border-top:1px solid var(--sidebar-line);
    margin-top:8px; padding-top:20px;
  }
  .avatar{
    width:36px; height:36px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-weight:700; font-size:13px; color:#fff;
    flex-shrink:0; position:relative;
  }
  .sidebar-user .avatar{ background: linear-gradient(135deg, var(--primary), #C084FC); }
  .sidebar-user .u-name{ font-size:14px; font-weight:600; color:#fff; }
  .sidebar-user .u-role{ font-size:11.5px; color:#8083A0; }
  .logout-btn{
    display:flex; align-items:center; gap:11px; margin-top:10px;
    padding:10px 12px; border-radius:12px; color:#8083A0;
    font-size:13.5px; font-weight:500; cursor:pointer;
    transition: color .2s, background .2s;
  }
  .logout-btn:hover{ color:#FB7185; background: rgba(251,113,133,0.08); }
  .logout-btn svg{ width:16px; height:16px; }

  .sidebar-toggle{ display:none; }

  /* ---------- Main ---------- */
  .main{ flex:1; min-width:0; padding: 26px 40px 60px; }

  .topbar{
    display:flex; align-items:center; gap:18px; margin-bottom:34px;
  }
  .search{
    flex:1; max-width:460px;
    display:flex; align-items:center; gap:10px;
    background:var(--card-bg); border:1px solid var(--card-border);
    border-radius:13px; padding:11px 16px;
    box-shadow: var(--shadow-sm);
    transition: box-shadow .25s ease, border-color .25s ease, transform .25s ease;
  }
  .search:focus-within{
    border-color: rgba(124,92,252,0.45);
    box-shadow: 0 0 0 4px rgba(124,92,252,0.10), var(--shadow-md);
    transform: translateY(-1px);
  }
  .search svg{ width:16px; height:16px; color:var(--muted-2); flex-shrink:0; }
  .search input{
    border:none; outline:none; font-family:'Inter'; font-size:14px; width:100%;
    background:transparent; color:var(--ink);
  }
  .search input::placeholder{ color:var(--muted-2); }
  .kbd{
    font-family:'JetBrains Mono'; font-size:10.5px; color:var(--muted-2);
    background:var(--bg-2); border:1px solid var(--card-border);
    padding:2px 6px; border-radius:6px;
  }

  .topbar-spacer{ flex:1; }

  .icon-btn{
    position:relative; width:42px; height:42px; border-radius:12px;
    background:var(--card-bg); border:1px solid var(--card-border);
    display:flex; align-items:center; justify-content:center; cursor:pointer;
    box-shadow: var(--shadow-sm);
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .icon-btn:hover{ transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .icon-btn svg{ width:18px; height:18px; color:var(--muted); }
  .ping{
    position:absolute; top:-4px; right:-4px;
    background: linear-gradient(135deg, var(--notif), #F97316);
    color:#fff; font-size:10px; font-weight:700; font-family:'JetBrains Mono';
    min-width:17px; height:17px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    border:2px solid var(--bg);
  }

  .user-chip{
    display:flex; align-items:center; gap:10px; cursor:pointer;
    padding:6px 12px 6px 6px; border-radius:14px;
    background:var(--card-bg); border:1px solid var(--card-border);
    box-shadow: var(--shadow-sm);
    transition: box-shadow .2s ease, transform .2s ease;
  }
  .user-chip:hover{ box-shadow: var(--shadow-md); transform: translateY(-2px); }
  .user-chip .avatar{ background: linear-gradient(135deg, var(--primary), var(--cyan)); }
  .user-chip .u-info{ line-height:1.2; }
  .user-chip .u-name{ font-size:13px; font-weight:600; color:var(--ink); }
  .user-chip .u-role{ font-size:10.5px; color:var(--muted-2); text-transform:uppercase; letter-spacing:.04em; }
  .user-chip svg.chev{ width:14px; height:14px; color:var(--muted-2); }

  /* ---------- Header / hero ---------- */
  .page-head{
    display:flex; align-items:flex-end; justify-content:space-between; gap:20px;
    margin-bottom:26px; flex-wrap:wrap;
  }
  .greeting{ font-size:26px; font-weight:600; letter-spacing:-0.02em; margin:0 0 6px; }
  .greeting .wave{ display:inline-block; animation: wave 2.2s ease-in-out infinite; transform-origin: 70% 70%; }
  @keyframes wave{ 0%,100%{ transform:rotate(0deg);} 15%{ transform:rotate(16deg);} 30%{ transform:rotate(-8deg);} 45%{ transform:rotate(16deg);} 60%{ transform:rotate(0deg);} }
  .sub{ color:var(--muted); font-size:14px; margin:0; }

  .create-btn{
    display:flex; align-items:center; gap:8px;
    background: linear-gradient(135deg, var(--primary), #6D4FEA 60%, var(--cyan));
    background-size:160% 160%;
    color:#fff; font-weight:600; font-size:14px; font-family:'Inter';
    border:none; padding:12px 20px; border-radius:13px; cursor:pointer;
    box-shadow: 0 10px 24px -8px rgba(124,92,252,0.55);
    transition: transform .2s ease, box-shadow .2s ease, background-position .4s ease;
  }
  .create-btn:hover{ transform: translateY(-2px); box-shadow: 0 16px 32px -8px rgba(124,92,252,0.65); background-position: 100% 40%; }
  .create-btn:active{ transform: translateY(0); }
  .create-btn svg{ width:16px; height:16px; }

  /* ---------- Stats ---------- */
  .stats{
    display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; margin-bottom:38px;
  }
  .stat-card{
    background:var(--card-bg); border:1px solid var(--card-border);
    border-radius:16px; padding:18px 20px;
    box-shadow: var(--shadow-sm);
    position:relative; overflow:hidden;
    opacity:0; transform: translateY(14px);
    animation: rise .55s cubic-bezier(.2,.7,.3,1) forwards;
    transition: box-shadow .25s ease, transform .25s ease;
  }
  .stat-card:hover{ box-shadow: var(--shadow-md); transform: translateY(-3px); }
  .stat-card .icon-wrap{
    width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center;
    margin-bottom:14px;
  }
  .stat-card .icon-wrap svg{ width:18px; height:18px; color:#fff; }
  .stat-num{ font-family:'Space Grotesk'; font-size:28px; font-weight:700; letter-spacing:-0.02em; }
  .stat-label{ font-size:12.5px; color:var(--muted); margin-top:2px; }
  .stat-trend{ position:absolute; top:18px; right:18px; font-family:'JetBrains Mono'; font-size:11px; font-weight:500; padding:3px 8px; border-radius:20px; }

  @keyframes rise{ to{ opacity:1; transform:none; } }

  /* ---------- Section head ---------- */
  .section-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .section-title{ font-size:18px; font-weight:600; letter-spacing:-0.01em; margin:0; }
  .section-title .count{ color:var(--muted-2); font-weight:500; font-size:14px; margin-left:8px; }
  .view-toggle{ display:flex; gap:4px; background:var(--bg-2); padding:4px; border-radius:10px; }
  .view-toggle button{
    border:none; background:transparent; padding:6px 12px; border-radius:8px; font-size:12.5px;
    font-weight:500; color:var(--muted); cursor:pointer; transition: all .2s ease;
  }
  .view-toggle button.active{ background:var(--card-bg); color:var(--ink); box-shadow:var(--shadow-sm); }

  /* ---------- Workspace grid ---------- */
  .grid{
    display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:18px;
  }
  .ws-card{
    background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius);
    padding:20px; position:relative; overflow:hidden; cursor:pointer;
    box-shadow: var(--shadow-sm);
    opacity:0; transform: translateY(16px);
    animation: rise .55s cubic-bezier(.2,.7,.3,1) forwards;
    transition: transform .3s cubic-bezier(.2,.7,.3,1), box-shadow .3s ease, border-color .3s ease;
  }
  .ws-card::after{
    content:''; position:absolute; inset:0; border-radius:var(--radius);
    padding:1px; background: linear-gradient(135deg, var(--g1), var(--g2));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    opacity:0; transition: opacity .3s ease; pointer-events:none;
  }
  .ws-card:hover{ transform: translateY(-6px); box-shadow: var(--shadow-lg); }
  .ws-card:hover::after{ opacity:1; }

  .ws-glow{
    position:absolute; top:-40%; right:-30%; width:160px; height:160px; border-radius:50%;
    background: linear-gradient(135deg, var(--g1), var(--g2)); filter: blur(40px); opacity:0.25;
    transition: opacity .3s ease, transform .4s ease;
  }
  .ws-card:hover .ws-glow{ opacity:0.4; transform: scale(1.15); }

  .ws-top{ display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; position:relative; }
  .ws-icon{
    width:46px; height:46px; border-radius:13px;
    background: linear-gradient(135deg, var(--g1), var(--g2));
    display:flex; align-items:center; justify-content:center;
    font-family:'Space Grotesk'; font-weight:700; font-size:18px; color:#fff;
    box-shadow: 0 8px 18px -6px rgba(0,0,0,0.25);
  }
  .ws-menu{
    width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center;
    color:var(--muted-2); cursor:pointer; transition: background .2s, color .2s;
  }
  .ws-menu:hover{ background:var(--bg-2); color:var(--ink); }
  .ws-menu svg{ width:16px; height:16px; }

  .ws-name{ font-family:'Space Grotesk'; font-size:17px; font-weight:600; margin:0 0 4px; letter-spacing:-0.01em; }
  .ws-desc{ font-size:13px; color:var(--muted); margin:0 0 18px; line-height:1.45; min-height:18px; }

  .ws-bottom{ display:flex; align-items:center; justify-content:space-between; position:relative; }
  .avatar-stack{ display:flex; }
  .avatar-stack .mini{
    width:26px; height:26px; border-radius:50%; border:2px solid var(--card-bg);
    margin-left:-8px; font-size:10px; font-weight:700; color:#fff;
    display:flex; align-items:center; justify-content:center;
    position:relative;
  }
  .avatar-stack .mini:first-child{ margin-left:0; }
  .mini.online::after{
    content:''; position:absolute; bottom:-1px; right:-1px; width:8px; height:8px; border-radius:50%;
    background: var(--success); border:2px solid var(--card-bg);
  }
  .mini.online.pulse::after{ animation: pulse-dot 2s ease-in-out infinite; }
  @keyframes pulse-dot{ 0%,100%{ box-shadow:0 0 0 0 rgba(45,212,167,0.5);} 50%{ box-shadow:0 0 0 4px rgba(45,212,167,0);} }

  .ws-tags{ display:flex; align-items:center; gap:6px; }
  .owner-tag{
    font-size:10.5px; font-weight:700; letter-spacing:.03em; color: var(--primary);
    background: rgba(124,92,252,0.10); padding:4px 9px; border-radius:20px;
  }
  .ws-time{ font-family:'JetBrains Mono'; font-size:10.5px; color:var(--muted-2); margin-top:12px; display:block; }

  /* create card */
  .ws-card.create{
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    border:2px dashed var(--card-border); background:transparent; box-shadow:none;
    min-height:212px; gap:10px;
  }
  .ws-card.create:hover{ border-color: rgba(124,92,252,0.5); background: rgba(124,92,252,0.03); box-shadow:none; transform: translateY(-4px); }
  .create-circle{
    width:46px; height:46px; border-radius:50%; background: var(--bg-2);
    display:flex; align-items:center; justify-content:center; color:var(--primary);
    transition: transform .3s cubic-bezier(.2,.7,.3,1), background .3s ease;
  }
  .ws-card.create:hover .create-circle{ transform: rotate(90deg) scale(1.1); background: rgba(124,92,252,0.14); }
  .create-circle svg{ width:20px; height:20px; }
  .ws-card.create span.label{ font-size:13.5px; font-weight:600; color:var(--muted); }

  /* stagger delays */
  .grid .ws-card:nth-child(1){ animation-delay: .05s; }
  .grid .ws-card:nth-child(2){ animation-delay: .11s; }
  .grid .ws-card:nth-child(3){ animation-delay: .17s; }
  .grid .ws-card:nth-child(4){ animation-delay: .23s; }
  .grid .ws-card:nth-child(5){ animation-delay: .29s; }
  .grid .ws-card:nth-child(6){ animation-delay: .35s; }
  .stats .stat-card:nth-child(1){ animation-delay: 0s; }
  .stats .stat-card:nth-child(2){ animation-delay: .06s; }
  .stats .stat-card:nth-child(3){ animation-delay: .12s; }
  .stats .stat-card:nth-child(4){ animation-delay: .18s; }

  /* Focus visibility */
  a:focus-visible, button:focus-visible, .nav-item:focus-visible, .ws-card:focus-visible, input:focus-visible{
    outline: 2px solid var(--primary); outline-offset: 2px;
  }

  /* ---------- Mobile ---------- */
  .hamburger{
    display:none; width:40px; height:40px; border-radius:10px; background:var(--card-bg);
    border:1px solid var(--card-border); align-items:center; justify-content:center; cursor:pointer;
    box-shadow: var(--shadow-sm);
  }
  .hamburger svg{ width:18px; height:18px; }
  .scrim{ display:none; }

  @media (max-width: 980px){
    .stats{ grid-template-columns: repeat(2,1fr); }
  }

  @media (max-width: 760px){
    .sidebar{
      position:fixed; left:0; top:0; height:100vh; transform: translateX(-100%);
      box-shadow: 24px 0 60px rgba(0,0,0,0.25);
    }
    .sidebar.open{ transform: translateX(0); }
    .hamburger{ display:flex; }
    .scrim.show{ display:block; position:fixed; inset:0; background:rgba(10,10,20,0.4); backdrop-filter: blur(2px); z-index:30; }
    .main{ padding: 20px 16px 60px; }
    .search{ order:3; max-width:none; width:100%; margin-top:12px; }
    .topbar{ flex-wrap:wrap; }
    .topbar-spacer{ display:none; }
    .greeting{ font-size:21px; }
    .stats{ grid-template-columns: 1fr 1fr; gap:12px; }
    .create-btn span{ display:none; }
    .create-btn{ padding:12px; }
  }
  @media (max-width: 460px){
    .stats{ grid-template-columns: 1fr 1fr; }
    .grid{ grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<div class="scrim" id="scrim"></div>

<div class="shell">
  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="brand">
      <div class="brand-mark">
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16M4 12h10M4 19h16" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      Collab<span class="accent">Ops</span>
    </div>

    <nav class="nav">
      <a class="nav-item active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>
        Dashboard
      </a>
      <a class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Workspaces
      </a>
      <a class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        Tasks
        <span class="nav-badge">5</span>
      </a>
      <a class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Notifications
        <span class="nav-badge">3</span>
      </a>
      <a class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Settings
      </a>
    </nav>

    <div class="sidebar-spacer"></div>

    <div class="sidebar-user">
      <div class="avatar">C</div>
      <div>
        <div class="u-name">Chitranshu</div>
        <div class="u-role">User</div>
      </div>
    </div>
    <div class="logout-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
      Logout
    </div>
  </aside>

  <!-- Main -->
  <main class="main">
    <div class="topbar">
      <div class="hamburger" id="hamburger">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </div>
      <div class="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input id="wsSearch" type="text" placeholder="Search workspaces...">
        <span class="kbd">⌘K</span>
      </div>
      <div class="topbar-spacer"></div>
      <div class="icon-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span class="ping">2</span>
      </div>
      <div class="user-chip">
        <div class="avatar">C</div>
        <div class="u-info">
          <div class="u-name">Chitranshu</div>
          <div class="u-role">User</div>
        </div>
        <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>

    <div class="page-head">
      <div>
        <h1 class="greeting">Good evening, Chitranshu <span class="wave">👋</span></h1>
        <p class="sub">Here's what's happening across your workspaces today.</p>
      </div>
      <button class="create-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
        <span>Create Workspace</span>
      </button>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="icon-wrap" style="background:linear-gradient(135deg,#7C5CFC,#A78BFA);"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
        <div class="stat-num" data-count="5">0</div>
        <div class="stat-label">Workspaces</div>
      </div>
      <div class="stat-card">
        <div class="icon-wrap" style="background:linear-gradient(135deg,#22D3EE,#0EA5E9);"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
        <div class="stat-num" data-count="5">0</div>
        <div class="stat-label">Active tasks</div>
        <div class="stat-trend" style="background:rgba(45,212,167,0.12); color:#0F9D74;">+2 today</div>
      </div>
      <div class="stat-card">
        <div class="icon-wrap" style="background:linear-gradient(135deg,#FB5B7C,#F97316);"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>
        <div class="stat-num" data-count="3">0</div>
        <div class="stat-label">Notifications</div>
      </div>
      <div class="stat-card">
        <div class="icon-wrap" style="background:linear-gradient(135deg,#2DD4A7,#10B981);"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
        <div class="stat-num" data-count="12">0</div>
        <div class="stat-label">Hrs active this week</div>
      </div>
    </div>

    <div class="section-head">
      <h2 class="section-title">My Workspaces <span class="count" id="wsCount">5 workspaces</span></h2>
      <div class="view-toggle">
        <button class="active">Grid</button>
        <button>List</button>
      </div>
    </div>

    <div class="grid" id="wsGrid">
      <!-- cards injected by JS -->
    </div>
  </main>
</div>

<script>
  const workspaces = [
    { name:"new", desc:"no", members:["A","B"], time:"Updated 2h ago", g1:"#22D3EE", g2:"#3B82F6" },
    { name:"hero", desc:"heeralal", members:["H","R"], time:"Updated 5h ago", g1:"#FB923C", g2:"#F43F5E" },
    { name:"classroom", desc:"discussion", members:["C","D","P"], time:"Updated 1d ago", g1:"#34D399", g2:"#0EA5E9" },
    { name:"chiku", desc:"kuch bhi", members:["C"], time:"Updated 3d ago", g1:"#C084FC", g2:"#F472B6" },
    { name:"CollabOps", desc:"Real-time collaboration platform", members:["C","T","S","N"], time:"Updated just now", g1:"#7C5CFC", g2:"#22D3EE" },
  ];

  const avatarColors = ["#7C5CFC","#22D3EE","#FB923C","#34D399","#F472B6","#F43F5E","#0EA5E9"];
  function colorFor(letter){
    const idx = letter.charCodeAt(0) % avatarColors.length;
    return avatarColors[idx];
  }

  const grid = document.getElementById('wsGrid');

  function renderCards(list){
    grid.innerHTML = '';
    list.forEach(ws => {
      const card = document.createElement('div');
      card.className = 'ws-card';
      card.style.setProperty('--g1', ws.g1);
      card.style.setProperty('--g2', ws.g2);
      card.tabIndex = 0;

      const avatars = ws.members.slice(0,3).map((m,i) =>
        `<div class="mini ${i===0?'online pulse':''}" style="background:${colorFor(m)}">${m}</div>`
      ).join('');
      const extra = ws.members.length > 3 ? `<div class="mini" style="background:#CBD0DC;color:#5A5E70;">+${ws.members.length-3}</div>` : '';

      card.innerHTML = `
        <div class="ws-glow"></div>
        <div class="ws-top">
          <div class="ws-icon">${ws.name.charAt(0).toUpperCase()}</div>
          <div class="ws-menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
          </div>
        </div>
        <h3 class="ws-name">${ws.name}</h3>
        <p class="ws-desc">${ws.desc}</p>
        <div class="ws-bottom">
          <div class="avatar-stack">${avatars}${extra}</div>
          <span class="owner-tag">OWNER</span>
        </div>
        <span class="ws-time">${ws.time}</span>
      `;
      grid.appendChild(card);
    });

    const createCard = document.createElement('div');
    createCard.className = 'ws-card create';
    createCard.tabIndex = 0;
    createCard.innerHTML = `
      <div class="create-circle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
      </div>
      <span class="label">Create Workspace</span>
    `;
    grid.appendChild(createCard);
  }

  renderCards(workspaces);

  // Search filter
  document.getElementById('wsSearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = workspaces.filter(w => w.name.toLowerCase().includes(q) || w.desc.toLowerCase().includes(q));
    renderCards(filtered);
    document.getElementById('wsCount').textContent = `${filtered.length} workspace${filtered.length!==1?'s':''}`;
  });

  // Count-up stat animation
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    let current = 0;
    const duration = 900;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * target);
      el.textContent = current;
      if(progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  // Mobile sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('scrim');
  document.getElementById('hamburger').addEventListener('click', () => {
    sidebar.classList.add('open');
    scrim.classList.add('show');
  });
  scrim.addEventListener('click', () => {
    sidebar.classList.remove('open');
    scrim.classList.remove('show');
  });
</script>
</body>
</html>