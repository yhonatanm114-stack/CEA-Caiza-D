const ES=['Óptimo','Lento','Requiere mantenimiento','Requiere actualización','Fuera de servicio'];
const CL={'Óptimo':'#22c55e','Lento':'#f59e0b','Requiere mantenimiento':'#f97316','Requiere actualización':'#38bdf8','Fuera de servicio':'#ef4444'};
const CO=[['cortapico','🔌','Cortapico'],['mouse','🖱️','Mouse'],['teclado','⌨️','Teclado'],['parlante','🔊','Parlante'],['audifono','🎧','Audífono']];
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let V='dash',EQ=[],F='Todos',S='';
async function L(e){e.preventDefault();const r=await api('login','POST',{usuario:$('#u').value,clave:$('#p').value});if(r.error)$('#err').textContent=r.error;else start(r.nombre);return false}
function start(n){$('#login').style.display='none';$('#app').style.display='grid';$('#who').textContent='👤 '+n;go('dash')}
api('me').then(r=>r.nombre&&start(r.nombre));
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>go(b.dataset.v));
async function go(v){V=v;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('on',b.dataset.v==v));EQ=await api('equipos');({dash,eq:eqv,inc:incv,man:manv})[v]()}
function X(){$('#mod').style.display='none'}function M(h){$('#mc').innerHTML=h;$('#mod').style.display='grid'}
const badge=e=>`<span class="tag" style="--c:${CL[e]}">${e}</span>`;
const comp=e=>CO.map(c=>`<span class="${e[c[0]]?'':'no'}">${c[1]} ${c[2]}</span>`).join('');
async function dash(){const [inc,reg]=await Promise.all([api('incidencias'),api('registros')]);
 const n=s=>EQ.filter(e=>e.estado==s).length,ok=n('Óptimo'),ab=inc.filter(i=>i.estado!='Resuelta').length,sp=EQ.filter(e=>!e.parlante).length;
 let a=0;const seg=ES.map(s=>{const p=n(s)/EQ.length*100,r=`${CL[s]} ${a}% ${a+p}%`;a+=p;return r}).join(',');
 const L=EQ.filter(e=>(F=='Todos'||e.estado==F)&&e.nombre.toLowerCase().includes(S));
 $('#main').innerHTML=`<h3>Panel del laboratorio</h3><div class="kpis">
 <div class="card kpi"><span>Equipos totales</span><b>${EQ.length}</b></div><div class="card kpi"><span>En estado óptimo</span><b style="color:#22c55e">${ok}</b></div>
 <div class="card kpi"><span>Necesitan atención</span><b style="color:#f59e0b">${EQ.length-ok}</b></div><div class="card kpi"><span>Incidencias abiertas</span><b style="color:#fb7185">${ab}</b></div>
 <div class="card kpi"><span>Sin parlante</span><b>${sp}</b></div><div class="card kpi"><span>Mantenimientos hechos</span><b>${reg.filter(r=>r.tipo!='Diagnóstico').length}</b></div></div>
 <div class="row"><div class="card"><b>Salud del laboratorio</b><div class="donut" style="background:conic-gradient(${seg||'#333 0 100%'})"><div>${EQ.length?Math.round(ok/EQ.length*100):0}%</div></div>
 <div class="lg">${ES.map(s=>`<span><i style="background:${CL[s]}"></i>${s}: <b>${n(s)}</b></span>`).join('')}</div></div>
 <div class="card"><b>Últimas incidencias</b><table><tr><th>Equipo</th><th>Problema</th><th>Prioridad</th><th>Estado</th></tr>${inc.slice(0,6).map(i=>`<tr><td>${esc(i.equipo)}</td><td>${esc(i.titulo)}</td><td>${i.prioridad}</td><td>${i.estado}</td></tr>`).join('')||'<tr><td colspan=4 style="color:var(--m)">Sin incidencias registradas 🎉</td></tr>'}</table></div></div>
 <div class="bar"><input placeholder="🔍 Buscar PC..." value="${esc(S)}" oninput="S=this.value.toLowerCase();dash()"></div>
 <div class="chips">${['Todos',...ES].map(s=>`<button class="chip ${F==s?'on':''}" onclick="F='${s}';dash()">${s}</button>`).join('')}</div>
 <div class="grid">${L.map(e=>`<div class="card pc" style="--c:${CL[e.estado]}" onclick="det(${e.id})"><h4>${esc(e.nombre)} ${badge(e.estado)}</h4>
 <p>🧠 CPU: <b>${esc(e.cpu)||'Sin definir'}</b></p><p>🖥️ Monitor: <b>${esc(e.monitor)||'Sin definir'}</b></p><div class="ic">${comp(e)}</div></div>`).join('')||'<p>Sin resultados</p>'}</div>`}
async function det(id){const e=EQ.find(x=>x.id==id),r=(await api('registros')).filter(x=>x.equipo_id==id).slice(0,4);
 M(`<h3>${esc(e.nombre)} ${badge(e.estado)}</h3><div class="rep"><span>🧠 CPU: <b>${esc(e.cpu)||'Sin definir'}</b></span><span>🖥️ Monitor: <b>${esc(e.monitor)||'Sin definir'}</b></span></div>
 <div class="ic">${comp(e)}</div><p style="color:var(--m)">Último mantenimiento: ${e.ultimo_mant||'Nunca'}<br>Notas: ${esc(e.notas)||'—'}</p>
 <b>Historial</b>${r.map(x=>`<small>${x.fecha} · ${x.tipo}: ${esc(x.detalle)}</small>`).join('')||'<small style="color:var(--m)">Sin registros</small>'}<div class="act"><button class="g" onclick="X()">Cerrar</button></div>`)}
function eqv(){$('#main').innerHTML=`<h3>Gestión de equipos</h3><div class="bar"><button onclick="eqf()">➕ Agregar equipo</button></div><div class="card" style="overflow:auto"><table><tr><th>PC</th><th>CPU</th><th>Monitor</th><th>Componentes</th><th>Estado</th><th></th></tr>
 ${EQ.map(e=>`<tr><td><b>${esc(e.nombre)}</b></td><td>${esc(e.cpu)||'—'}</td><td>${esc(e.monitor)||'—'}</td><td>${CO.filter(c=>e[c[0]]).map(c=>c[1]).join(' ')}</td><td>${badge(e.estado)}</td>
 <td style="white-space:nowrap"><button class="g" onclick="eqf(${e.id})">✏️</button> <button class="r" onclick="eqd(${e.id})">🗑️</button></td></tr>`).join('')}</table></div>`}
function eqf(id){const e=EQ.find(x=>x.id==id)||{nombre:'PC'+(EQ.length+1),cpu:'',monitor:'',cortapico:1,mouse:1,teclado:1,parlante:1,audifono:1,estado:'Óptimo',notas:''};
 M(`<h3>${id?'Editar':'Nuevo'} equipo</h3><label>Nombre<input id="f_nombre" value="${esc(e.nombre)}"></label><label>Marca CPU<input id="f_cpu" value="${esc(e.cpu)}" placeholder="Ej: HP, Dell, Lenovo"></label>
 <label>Marca Monitor<input id="f_monitor" value="${esc(e.monitor)}" placeholder="Ej: Samsung, LG"></label>${CO.map(c=>`<label class="c"><input type="checkbox" id="f_${c[0]}" ${e[c[0]]?'checked':''}>${c[1]} Tiene ${c[2].toLowerCase()}</label>`).join('')}
 <label>Estado<select id="f_estado">${ES.map(s=>`<option ${s==e.estado?'selected':''}>${s}</option>`).join('')}</select></label><label>Notas<textarea id="f_notas">${esc(e.notas)}</textarea></label>
 <div class="act"><button class="g" onclick="X()">Cancelar</button><button onclick="eqs(${id||0})">Guardar</button></div>`)}
async function eqs(id){const d={};['nombre','cpu','monitor','estado','notas'].forEach(k=>d[k]=$('#f_'+k).value);CO.forEach(c=>d[c[0]]=+$('#f_'+c[0]).checked);
 await api('equipos'+(id?'/'+id:''),id?'PUT':'POST',d);X();go('eq')}
async function eqd(id){if(confirm('¿Eliminar este equipo y su historial?')){await api('equipos/'+id,'DELETE');go('eq')}}
async function incv(){const l=await api('incidencias');$('#main').innerHTML=`<h3>Incidencias</h3><div class="bar"><button onclick="incf()">➕ Reportar incidencia</button></div><div class="card" style="overflow:auto"><table><tr><th>Fecha</th><th>Equipo</th><th>Problema</th><th>Prioridad</th><th>Reportó</th><th>Estado</th><th></th></tr>
 ${l.map(i=>`<tr><td>${i.fecha}</td><td>${esc(i.equipo)}</td><td><b>${esc(i.titulo)}</b><br><small style="color:var(--m)">${esc(i.descripcion)}</small></td><td>${i.prioridad}</td><td>${esc(i.autor.split(' ')[0])}</td>
 <td><select onchange="api('incidencias/${i.id}','PUT',{estado:this.value})">${['Abierta','En proceso','Resuelta'].map(s=>`<option ${s==i.estado?'selected':''}>${s}</option>`).join('')}</select></td><td><button class="r" onclick="api('incidencias/${i.id}','DELETE').then(incv)">🗑️</button></td></tr>`).join('')||'<tr><td colspan=7>Sin incidencias</td></tr>'}</table></div>`}
const opts=()=>EQ.map(e=>`<option value="${e.id}">${esc(e.nombre)}</option>`).join('');
function incf(){M(`<h3>Reportar incidencia</h3><label>Equipo<select id="i_e">${opts()}</select></label><label>Problema<input id="i_t" placeholder="Ej: No enciende, se congela..."></label>
 <label>Descripción<textarea id="i_d"></textarea></label><label>Prioridad<select id="i_p"><option>Baja</option><option selected>Media</option><option>Alta</option></select></label>
 <div class="act"><button class="g" onclick="X()">Cancelar</button><button onclick="incs()">Guardar</button></div>`)}
async function incs(){if(!$('#i_t').value)return;await api('incidencias','POST',{equipo_id:+$('#i_e').value,titulo:$('#i_t').value,descripcion:$('#i_d').value,prioridad:$('#i_p').value});X();incv()}
async function manv(){const l=await api('registros');$('#main').innerHTML=`<h3>Diagnósticos y mantenimiento</h3><div class="bar"><button onclick="manf()">➕ Nuevo registro</button><button class="g" onclick="reporte()">📄 Reporte PDF</button></div><div class="card" style="overflow:auto"><table><tr><th>Fecha</th><th>Equipo</th><th>Tipo</th><th>Detalle</th><th>Próximo</th><th>Por</th><th></th></tr>
 ${l.map(r=>`<tr><td>${r.fecha}</td><td>${esc(r.equipo)}</td><td>${r.tipo}</td><td>${esc(r.detalle)}</td><td>${r.proximo||'—'}</td><td>${esc(r.autor.split(' ')[0])}</td><td><button class="r" onclick="api('registros/${r.id}','DELETE').then(manv)">🗑️</button></td></tr>`).join('')||'<tr><td colspan=7>Sin registros</td></tr>'}</table></div>`}
function manf(){M(`<h3>Nuevo registro</h3><label>Equipo<select id="m_e">${opts()}</select></label><label>Tipo<select id="m_t"><option>Diagnóstico</option><option>Preventivo</option><option>Correctivo</option><option>Actualización</option></select></label>
 <label>Detalle<textarea id="m_d" placeholder="Qué se revisó o se hizo"></textarea></label><label>Resultado: estado del equipo<select id="m_s">${ES.map(s=>`<option>${s}</option>`).join('')}</select></label>
 <label>Próximo mantenimiento<input type="date" id="m_p"></label><div class="act"><button class="g" onclick="X()">Cancelar</button><button onclick="mans()">Guardar</button></div>`)}
async function mans(){await api('registros','POST',{equipo_id:+$('#m_e').value,tipo:$('#m_t').value,detalle:$('#m_d').value,nuevo_estado:$('#m_s').value,proximo:$('#m_p').value});X();manv()}
/* ===== Reporte PDF: equipos diagnosticados y fechas de mantenimiento ===== */
async function reporte(){
 const [eq,reg]=await Promise.all([api('equipos'),api('registros')]);
 const {jsPDF}=window.jspdf,d=new jsPDF({orientation:'landscape'}),by=id=>reg.filter(r=>r.equipo_id==id);
 const dg=eq.filter(e=>by(e.id).length),sd=eq.filter(e=>!by(e.id).length),ok=eq.filter(e=>e.estado=='Óptimo').length;
 d.setFontSize(16);d.text('CEA Caiza "D" - Reporte de diagnósticos y mantenimiento',14,16);
 d.setFontSize(10);d.text(`Laboratorio de computación | Generado: ${new Date().toLocaleString('es-BO')} | Por: ${$('#who').textContent.replace('👤 ','')}`,14,23);
 d.text(`Total de equipos: ${eq.length}   Diagnosticados: ${dg.length}   En estado óptimo: ${ok}   Requieren atención: ${eq.length-ok}`,14,29);
 const hd=c=>({head:[c],headStyles:{fillColor:[91,70,200]},styles:{fontSize:9},margin:{left:14,right:14}});
 d.autoTable({startY:34,...hd(['Equipo','CPU','Monitor','Estado actual','Último diagnóstico','Último mantenimiento','Próximo mantenimiento']),
  body:dg.map(e=>{const r=by(e.id),px=r.find(x=>x.proximo);return [e.nombre,e.cpu||'-',e.monitor||'-',e.estado,(r.find(x=>x.tipo=='Diagnóstico')||{}).fecha||'-',e.ultimo_mant||'-',px?px.proximo:'-']})});
 let y=d.lastAutoTable.finalY+8;if(y>180){d.addPage();y=16}
 d.setFontSize(12);d.text('Historial de diagnósticos y mantenimientos',14,y);
 d.autoTable({startY:y+3,...hd(['Fecha','Equipo','Tipo','Detalle','Próximo mantenimiento','Registrado por']),
  body:reg.map(r=>[r.fecha,r.equipo,r.tipo,r.detalle||'-',r.proximo||'-',r.autor])});
 y=d.lastAutoTable.finalY+8;if(y>190){d.addPage();y=16}
 d.setFontSize(10);d.text(d.splitTextToSize('Equipos sin diagnosticar: '+(sd.map(e=>e.nombre).join(', ')||'ninguno'),265),14,y);
 d.save('Reporte_Laboratorio_CEA_Caiza_D.pdf');
}
