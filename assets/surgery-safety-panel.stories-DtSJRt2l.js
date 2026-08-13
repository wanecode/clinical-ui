import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{h as n}from"./iframe-CUdBhyno.js";import{b as r,c as i,h as a,m as o,t as s,v as c}from"./fixtures-D5uNXNAw.js";function l({items:e,state:t=`ready`,initialVigilanceAcknowledged:n=!1}){let[r,i]=(0,u.useState)(`all`),[s,l]=(0,u.useState)(n),p=(0,u.useMemo)(()=>e.filter(e=>r===`all`||e.group===r),[e,r]),m=e.filter(e=>e.status===`pending`).length;return(0,d.jsx)(a,{title:`Sécurité chirurgicale ORL`,eyebrow:`Procédure et postopératoire`,description:`Contrôles avant geste, implants, consignes postopératoires et préparation aux urgences.`,status:s?`Vigilance acquittée`:`${m} point en attente`,statusTone:s?`success`:`warning`,children:t===`ready`?(0,d.jsxs)(`div`,{className:`ent-safety`,children:[(0,d.jsx)(c,{label:`Filtrer les contrôles`,value:r,onChange:i,options:[{value:`all`,label:`Tous`},{value:`pre-procedure`,label:`Avant geste`},{value:`implant`,label:`Implants`},{value:`postoperative`,label:`Postop.`},{value:`emergency`,label:`Urgence`}]}),(0,d.jsxs)(`div`,{className:`ent-safety__layout`,children:[(0,d.jsxs)(`section`,{className:`ent-panel`,children:[(0,d.jsx)(`h3`,{children:`Registre de contrôle`}),(0,d.jsx)(`ul`,{className:`ent-checklist`,"aria-live":`polite`,children:p.map(e=>(0,d.jsxs)(`li`,{"data-status":e.status,children:[(0,d.jsx)(`span`,{className:`ent-checklist__box`,"aria-hidden":`true`,children:e.status===`checked`?`✓`:e.status===`not-applicable`?`—`:`!`}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`strong`,{children:e.label}),(0,d.jsxs)(`span`,{children:[f[e.group],e.checkedBy?` · ${e.checkedBy}`:``,e.checkedAt?` · ${e.checkedAt}`:``]})]}),(0,d.jsx)(`em`,{children:e.status===`checked`?`Vérifié`:e.status===`not-applicable`?`Non applicable`:`En attente`})]},e.id))})]}),(0,d.jsxs)(`aside`,{className:`ent-panel ent-vigilance`,"data-acknowledged":s||void 0,children:[(0,d.jsx)(`span`,{className:`ent-vigilance__shield`,"aria-hidden":`true`,children:`◇`}),(0,d.jsx)(`p`,{className:`ent-eyebrow`,children:`Vigilance`}),(0,d.jsx)(`h3`,{children:s?`Lecture acquittée`:`Lecture requise`}),(0,d.jsx)(`p`,{children:`Un point postopératoire reste en attente. L’acquittement enregistre la lecture, pas la réalisation du contrôle.`}),(0,d.jsx)(`button`,{type:`button`,className:`ent-button`,"aria-pressed":s,onClick:()=>l(e=>!e),children:s?`Annuler l’acquittement`:`Acquitter la vigilance`})]})]})]}):(0,d.jsx)(o,{state:t})})}var u,d,f;function p(){return(p=e((()=>{u=n(),r(),d=t(),f={"pre-procedure":`Avant le geste`,implant:`Implants`,postoperative:`Postopératoire`,emergency:`Urgence`},l.__docgenInfo={description:``,methods:[],displayName:`EntSurgerySafetyPanel`,props:{items:{required:!0,tsType:{name:`Array`,elements:[{name:`SafetyChecklistItem`}],raw:`SafetyChecklistItem[]`},description:``},state:{required:!1,tsType:{name:`union`,raw:`| "ready"
| "loading"
| "empty"
| "error"
| "forbidden"
| "partial"
| "not-calculable"`,elements:[{name:`literal`,value:`"ready"`},{name:`literal`,value:`"loading"`},{name:`literal`,value:`"empty"`},{name:`literal`,value:`"error"`},{name:`literal`,value:`"forbidden"`},{name:`literal`,value:`"partial"`},{name:`literal`,value:`"not-calculable"`}]},description:``,defaultValue:{value:`"ready"`,computed:!1}},initialVigilanceAcknowledged:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}var m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{s(),p(),{expect:m,userEvent:h,within:g}=__STORYBOOK_MODULE_TEST__,_={title:`ORL/08 Chirurgie/EntSurgerySafetyPanel`,component:l,tags:[`autodocs`,`test`],args:{items:i}},v={play:async({canvasElement:e})=>{let t=g(e),n=t.getByRole(`button`,{name:`Acquitter la vigilance`});await h.click(n),await m(t.getByText(`Lecture acquittée`)).toBeVisible(),await m(t.getByRole(`button`,{name:`Annuler l’acquittement`})).toHaveAttribute(`aria-pressed`,`true`)}},y={args:{initialVigilanceAcknowledged:!0}},b={args:{state:`loading`}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const acknowledge = canvas.getByRole("button", {
      name: "Acquitter la vigilance"
    });
    await userEvent.click(acknowledge);
    await expect(canvas.getByText("Lecture acquittée")).toBeVisible();
    await expect(canvas.getByRole("button", {
      name: "Annuler l’acquittement"
    })).toHaveAttribute("aria-pressed", "true");
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    initialVigilanceAcknowledged: true
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    state: "loading"
  }
}`,...b.parameters?.docs?.source}}},x=[`PendingWithAcknowledgement`,`Acknowledged`,`Loading`]})))()}S();export{y as Acknowledged,b as Loading,v as PendingWithAcknowledgement,x as __namedExportsOrder,_ as default};