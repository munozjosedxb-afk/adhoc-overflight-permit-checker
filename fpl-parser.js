// ICAO FPL extraction helpers. Kept separate from the main UI so each change can be verified safely.
function parseCoreFpl(raw){
  const s=String(raw||'').replace(/\s+/g,' ').trim();
  const m=s.match(/\(FPL-([A-Z0-9\/]+).*?-([A-Z]{4})(\d{4}).*?-N(\d{4})(F\d{3,4}).*?-([A-Z]{4})(\d{4})/i);
  if(!m) return {valid:false};
  const date=(s.match(/DOF\/(\d{6})/i)||[])[1]||'';
  const reg=(s.match(/REG\/([A-Z0-9-]+)/i)||[])[1]||'';
  return {valid:true,callsign:m[1],origin:m[2],eobt:m[3],speed:m[4],level:m[5],destination:m[6],eta:m[7],date,reg};
}
