import React, { useState } from "react";

// Replit-friendly FINAL: ensure fields and labels are left aligned, and all input fields and buttons line up horizontally

const SA_PROVINCES = [
  { value: "EC", label: "Eastern Cape" },
  { value: "FS", label: "Free State" },
  { value: "GP", label: "Gauteng" },
  { value: "KZN", label: "KwaZulu-Natal" },
  { value: "LP", label: "Limpopo" },
  { value: "MP", label: "Mpumalanga" },
  { value: "NC", label: "Northern Cape" },
  { value: "NW", label: "North West" },
  { value: "WC", label: "Western Cape" },
];

function CompanySettingsAlignedReplit() {
  const [f, setF] = useState({
    name: "",
    registration: "",
    taxNumber: "",
    vatNumber: "",
    payeNumber: "",
    sdlNumber: "",
    uifNumber: "",
    uifEmployerReference: "",

    telephone: "",
    email: "",
    extratimeRate: "1.33",
    overtimeRate: "1.5",
    doubletimeRate: "2",
    lastDayOfWeek: "Sunday",
    sdlContribution: false,

    // Physical
    physicalAddress: "",
    physicalAddressLine2: "",
    physicalAddressLine3: "",
    province: "",
    postalCode: "",

    // Postal
    postalAddress: "",
    postalAddressLine2: "",
    postalAddressLine3: "",
    postalProvince: "",
    postalPostalCode: "",
  });

  const setValue = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const copyFromPhysical = () => {
    setValue("postalAddress", f.physicalAddress || "");
    setValue("postalAddressLine2", f.physicalAddressLine2 || "");
    setValue("postalAddressLine3", f.physicalAddressLine3 || "");
    setValue("postalProvince", f.province || "");
    setValue("postalPostalCode", f.postalCode || "");
  };

  return (
    <div className="replit-wrap">
      <style>{`
        .replit-wrap{font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif; background:#f7f7fa; min-height:100vh; padding:24px; box-sizing:border-box;}
        .replit-form{max-width:1120px; margin:0 auto;}
        .replit-title{font-size:20px; font-weight:600; margin:0 0 16px;}

        /* Master grid: enforce horizontal alignment */
        .grid4{display:grid; grid-template-columns: 200px 1fr 200px 1fr; column-gap:16px; row-gap:16px; align-items:center}
        @media (max-width: 1023px){ .grid4{grid-template-columns: 1fr;} }

        .label{font-size:14px; font-weight:700; line-height:1.3; text-align:left}
        .control{width:100%; box-sizing:border-box; border:1px solid #d0d7e2; border-radius:6px; padding:10px 12px; font-size:14px; background:#fff; min-height:40px; text-align:left}
        .control:focus{outline:none; border-color:#7aa7ff; box-shadow:0 0 0 3px rgba(122,167,255,.25)}

        .checkbox-wrap{display:flex; align-items:center; gap:8px}

        .addresses{display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:24px}
        @media (max-width: 1023px){ .addresses{grid-template-columns:1fr} }
        .card{border:1px solid #dfe5f0; border-radius:8px; background:#fff; padding:16px}
        .cardHead{display:grid; grid-template-columns:200px 1fr; align-items:center; margin-bottom:12px}
        .cardHead h3{font-size:14px; font-weight:700; text-align:left;}
        .cardHead .btn{justify-self:start;}

        .btn{display:inline-flex; align-items:center; justify-content:flex-start; gap:6px; font-size:12px; padding:8px 12px; border-radius:6px; cursor:pointer; border:1px solid #d0d7e2; background:#fff}
        .btn:hover{border-color:#7aa7ff}
        .ghost{visibility:hidden}

        .grid2{display:grid; grid-template-columns:200px 1fr; gap:16px; align-items:center}
        .two{display:grid; grid-template-columns:1fr 1fr; gap:16px}
      `}</style>

      <div className="replit-form">
        <h1 className="replit-title">Company Settings — Aligned Preview</h1>

        <div className="grid4">
          <label className="label" htmlFor="name">Company name *</label>
          <input className="control" id="name" value={f.name} onChange={(e)=>setValue('name', e.target.value)} placeholder="Company name" />
          <label className="label" htmlFor="telephone">Telephone</label>
          <input className="control" id="telephone" value={f.telephone} onChange={(e)=>setValue('telephone', e.target.value)} placeholder="Telephone number" />

          <label className="label" htmlFor="registration">Company registration *</label>
          <input className="control" id="registration" value={f.registration} onChange={(e)=>setValue('registration', e.target.value)} placeholder="2006156834" />
          <label className="label" htmlFor="email">Email</label>
          <input className="control" id="email" value={f.email} onChange={(e)=>setValue('email', e.target.value)} placeholder="Email address" />

          <label className="label" htmlFor="taxNumber">Tax number *</label>
          <input className="control" id="taxNumber" value={f.taxNumber} onChange={(e)=>setValue('taxNumber', e.target.value)} placeholder="Tax number" />
          <label className="label" htmlFor="extratimeRate">Extratime rate *</label>
          <input className="control" id="extratimeRate" type="number" step="0.01" value={f.extratimeRate} onChange={(e)=>setValue('extratimeRate', e.target.value)} placeholder="1.33" />

          <label className="label" htmlFor="vatNumber">VAT number *</label>
          <input className="control" id="vatNumber" value={f.vatNumber} onChange={(e)=>setValue('vatNumber', e.target.value)} placeholder="VAT number" />
          <label className="label" htmlFor="overtimeRate">Overtime rate *</label>
          <input className="control" id="overtimeRate" type="number" step="0.01" value={f.overtimeRate} onChange={(e)=>setValue('overtimeRate', e.target.value)} placeholder="1.5" />

          <label className="label" htmlFor="payeNumber">PAYE number *</label>
          <input className="control" id="payeNumber" value={f.payeNumber} onChange={(e)=>setValue('payeNumber', e.target.value)} placeholder="7370773675" />
          <label className="label" htmlFor="doubletimeRate">Doubletime rate *</label>
          <input className="control" id="doubletimeRate" type="number" step="0.01" value={f.doubletimeRate} onChange={(e)=>setValue('doubletimeRate', e.target.value)} placeholder="2" />

          <label className="label" htmlFor="sdlNumber">SDL number *</label>
          <input className="control" id="sdlNumber" value={f.sdlNumber} onChange={(e)=>setValue('sdlNumber', e.target.value)} placeholder="L370773675" />
          <label className="label" htmlFor="lastDayOfWeek">Last day of week *</label>
          <select className="control" id="lastDayOfWeek" value={f.lastDayOfWeek} onChange={(e)=>setValue('lastDayOfWeek', e.target.value)}>
            <option value="">Select last day of week</option>
            {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d)=>(
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <label className="label" htmlFor="uifNumber">UIF number *</label>
          <input className="control" id="uifNumber" value={f.uifNumber} onChange={(e)=>setValue('uifNumber', e.target.value)} placeholder="U370773675" />
          <label className="label" htmlFor="sdlContribution">SDL contribution</label>
          <div className="checkbox-wrap">
            <input id="sdlContribution" type="checkbox" checked={f.sdlContribution} onChange={(e)=>setValue('sdlContribution', e.target.checked)} />
            <span style={{fontSize:14}}>Enable SDL contribution</span>
          </div>

          <label className="label" htmlFor="uifEmployerReference">UIF employer (DOL)</label>
          <input className="control" id="uifEmployerReference" value={f.uifEmployerReference} onChange={(e)=>setValue('uifEmployerReference', e.target.value)} placeholder="2035064/8" />
          <div></div>
          <div></div>

          <label className="label" htmlFor="logo">Company logo</label>
          <div>
            <input className="control" id="logo" type="file" onChange={()=>{}} />
            <p style={{fontSize:12, color:'#6b7280', marginTop:6}}>Upload JPG or PNG file (max 5MB recommended)</p>
          </div>
          <div></div>
          <div></div>
        </div>

        {/* Addresses: aligned with same label-input grid */}
        <div className="addresses">
          <div className="card">
            <div className="cardHead">
              <h3>Physical address *</h3>
              <button className="btn ghost">Copy from Physical</button>
            </div>
            <div className="grid2">
              <label className="label">Address Line 1</label>
              <input className="control" value={f.physicalAddress} onChange={(e)=>setValue('physicalAddress', e.target.value)} placeholder="Address Line 1" />

              <label className="label">Address Line 2</label>
              <input className="control" value={f.physicalAddressLine2} onChange={(e)=>setValue('physicalAddressLine2', e.target.value)} placeholder="Address Line 2 (Optional)" />

              <label className="label">Address Line 3</label>
              <input className="control" value={f.physicalAddressLine3} onChange={(e)=>setValue('physicalAddressLine3', e.target.value)} placeholder="Address Line 3 (Optional)" />

              <label className="label">Province & Postal Code</label>
              <div className="two">
                <select className="control" value={f.province} onChange={(e)=>setValue('province', e.target.value)}>
                  <option value="">Select province</option>
                  {SA_PROVINCES.map((p)=>(<option key={p.value} value={p.value}>{p.label}</option>))}
                </select>
                <input className="control" value={f.postalCode} onChange={(e)=>setValue('postalCode', e.target.value)} placeholder="Postal Code" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="cardHead">
              <h3>Postal address *</h3>
              <button className="btn" type="button" onClick={copyFromPhysical}>Copy from Physical</button>
            </div>
            <div className="grid2">
              <label className="label">Address Line 1</label>
              <input className="control" value={f.postalAddress} onChange={(e)=>setValue('postalAddress', e.target.value)} placeholder="Address Line 1" />

              <label className="label">Address Line 2</label>
              <input className="control" value={f.postalAddressLine2} onChange={(e)=>setValue('postalAddressLine2', e.target.value)} placeholder="Address Line 2 (Optional)" />

              <label className="label">Address Line 3</label>
              <input className="control" value={f.postalAddressLine3} onChange={(e)=>setValue('postalAddressLine3', e.target.value)} placeholder="Address Line 3 (Optional)" />

              <label className="label">Province & Postal Code</label>
              <div className="two">
                <select className="control" value={f.postalProvince} onChange={(e)=>setValue('postalProvince', e.target.value)}>
                  <option value="">Select province</option>
                  {SA_PROVINCES.map((p)=>(<option key={p.value} value={p.value}>{p.label}</option>))}
                </select>
                <input className="control" value={f.postalPostalCode} onChange={(e)=>setValue('postalPostalCode', e.target.value)} placeholder="Postal Code" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanySettingsAlignedReplit;
