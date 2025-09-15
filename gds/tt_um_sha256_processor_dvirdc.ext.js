// Optional per-project extension for tt_um_sha256_processor_dvirdc
// Exposes window.ProjectExtension with create({sim, container, getProbes, getPin, setPin})

window.ProjectExtension = (function(){
    function create({container, getProbes, setPin}){
        const state = { active:false, data:[], index:0, cooldown:0, done:false };
        const root = document.createElement('div');
        const btn = document.createElement('button');
        btn.textContent = 'Start dummy feed';
        const status = document.createElement('span');
        status.style.marginLeft = '8px';
        status.style.opacity = '0.8';
        root.appendChild(btn);
        root.appendChild(status);
        container.appendChild(root);

        function makeDummyBytes(){
            const text = 'Hello TinyTapeout! ';
            const arr = [];
            for (let r=0; r<8; r++) for (let i=0; i<text.length; i++) arr.push(text.charCodeAt(i)&0xFF);
            return arr;
        }
        function setByte(byte){ for (let i=0; i<8; i++) setPin(`ui_in[${i}]`, (byte>>i)&1); }
        function reset(){
            for (let i=0; i<8; i++) setPin(`ui_in[${i}]`, 0);
            ['VALID_IN','uio_in[0]','LAST_IN','uio_in[1]'].forEach(n=>setPin(n,0));
            setPin('rst_n', 0); setPin('rst_n', 1);
            state.index=0; state.cooldown=0; state.done=false; status.textContent='';
            document.querySelectorAll('.pin-dot').forEach(el => el.dataset.v = '-1');
        }

        state.data = makeDummyBytes();
        btn.onclick = () => {
            if (state.done) { reset(); btn.textContent='Start dummy feed'; return; }
            state.active = !state.active;
            btn.textContent = state.active ? 'Stop dummy feed' : 'Start dummy feed';
        };

        function onFrame(){
            if (!state.active) return;
            if (state.index >= state.data.length) { setPin('VALID_IN',0); setPin('LAST_IN',0); state.active=false; state.done=true; btn.textContent='Reset feed'; status.textContent='Done'; return; }
            if (state.cooldown>0) { state.cooldown--; return; }
            let ready=true; const probes=getProbes(); const r=probes.find(p=>p.name==='READY_OUT')||probes.find(p=>p.name==='uio_out[4]'); if (r) ready=!!r.value; if (!ready) return;
            const b=state.data[state.index]; setByte(b); const last=(state.index===state.data.length-1)?1:0; ['VALID_IN','uio_in[0]'].forEach(n=>setPin(n,1)); ['LAST_IN','uio_in[1]'].forEach(n=>setPin(n,last));
            const ch=(b>=32 && b<127)?String.fromCharCode(b):'.'; status.textContent=`idx ${state.index}/${state.data.length}  byte 0x${b.toString(16).padStart(2,'0')} '${ch}'`;
            state.index++; state.cooldown=8;
        }
        return { onFrame };
    }
    return { create };
})();


