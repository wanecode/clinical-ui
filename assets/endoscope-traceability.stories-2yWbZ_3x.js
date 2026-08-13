import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{h as n}from"./iframe-CUdBhyno.js";import{_ as r,b as i,h as a,m as o,t as s,u as c,y as l}from"./fixtures-D5uNXNAw.js";function u({record:e,state:t=`ready`}){let[n,i]=(0,d.useState)(!1),s=e.leakTest===`passed`&&e.cleaning===`complete`&&e.disinfection===`released`;return(0,f.jsx)(a,{title:`Traçabilité de l’endoscope`,eyebrow:`Désinfection et mise à disposition`,description:`Chaîne de retraitement liée sans ambiguïté au dispositif et à la procédure.`,status:s?`Libéré`:`Non libéré`,statusTone:s?`success`:`warning`,actions:(0,f.jsxs)(`button`,{type:`button`,className:`ent-button ent-button--quiet`,"aria-expanded":n,onClick:()=>i(e=>!e),children:[n?`Masquer`:`Voir`,` la piste d’audit`]}),children:t===`ready`?(0,f.jsxs)(`div`,{className:`ent-traceability`,children:[(0,f.jsxs)(`section`,{className:`ent-traceability__identity`,children:[(0,f.jsx)(`p`,{className:`ent-eyebrow`,children:`Dispositif`}),(0,f.jsx)(`strong`,{children:e.scopeIdentifier}),(0,f.jsx)(l,{reference:e.procedureReference})]}),(0,f.jsxs)(`ol`,{className:`ent-process`,"aria-label":`Étapes de retraitement`,children:[(0,f.jsxs)(`li`,{"data-status":e.leakTest===`passed`?`complete`:`incomplete`,children:[(0,f.jsx)(`span`,{children:`01`}),(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`strong`,{children:`Test d’étanchéité`}),(0,f.jsx)(`small`,{children:e.leakTest===`passed`?`Réussi`:e.leakTest===`failed`?`Échec`:`Non enregistré`})]})]}),(0,f.jsxs)(`li`,{"data-status":e.cleaning===`complete`?`complete`:`incomplete`,children:[(0,f.jsx)(`span`,{children:`02`}),(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`strong`,{children:`Nettoyage`}),(0,f.jsx)(`small`,{children:e.cleaning===`complete`?`Complet`:`Incomplet`})]})]}),(0,f.jsxs)(`li`,{"data-status":e.disinfection===`released`?`complete`:`incomplete`,children:[(0,f.jsx)(`span`,{children:`03`}),(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`strong`,{children:`Désinfection`}),(0,f.jsx)(`small`,{children:e.disinfection===`released`?`Cycle libéré`:e.disinfection===`quarantined`?`Quarantaine`:`En attente`})]})]}),(0,f.jsxs)(`li`,{"data-status":e.vigilanceAcknowledged?`complete`:`incomplete`,children:[(0,f.jsx)(`span`,{children:`04`}),(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`strong`,{children:`Vigilance`}),(0,f.jsx)(`small`,{children:e.vigilanceAcknowledged?`Acquittée`:`À relire`})]})]})]}),(0,f.jsxs)(`dl`,{className:`ent-metric-grid ent-metric-grid--four`,children:[(0,f.jsx)(r,{label:`Cycle`,value:e.cycleIdentifier}),(0,f.jsx)(r,{label:`Opérateur`,value:e.operator??`Non consigné`}),(0,f.jsx)(r,{label:`Libéré le`,value:e.releasedAt??`Non libéré`}),(0,f.jsx)(r,{label:`État final`,value:s?`Disponible`:`Bloqué`})]}),n?(0,f.jsxs)(`div`,{className:`ent-audit`,"aria-live":`polite`,children:[(0,f.jsx)(`strong`,{children:`Piste d’audit synthétique`}),(0,f.jsxs)(`code`,{children:[e.cycleIdentifier,` → `,e.scopeIdentifier,` → `,e.procedureReference]}),(0,f.jsx)(`span`,{children:`Les identifiants sont synthétiques et ne correspondent à aucun dispositif réel.`})]}):null]}):(0,f.jsx)(o,{state:t})})}var d,f;function p(){return(p=e((()=>{d=n(),i(),f=t(),u.__docgenInfo={description:``,methods:[],displayName:`EndoscopeTraceability`,props:{record:{required:!0,tsType:{name:`EndoscopeTraceabilityRecord`},description:``},state:{required:!1,tsType:{name:`union`,raw:`| "ready"
| "loading"
| "empty"
| "error"
| "forbidden"
| "partial"
| "not-calculable"`,elements:[{name:`literal`,value:`"ready"`},{name:`literal`,value:`"loading"`},{name:`literal`,value:`"empty"`},{name:`literal`,value:`"error"`},{name:`literal`,value:`"forbidden"`},{name:`literal`,value:`"partial"`},{name:`literal`,value:`"not-calculable"`}]},description:``,defaultValue:{value:`"ready"`,computed:!1}}}}})))()}var m,h,g,_,v,y,b;function x(){return(x=e((()=>{p(),s(),{expect:m,userEvent:h,within:g}=__STORYBOOK_MODULE_TEST__,_={title:`ORL/09 Traçabilité/EndoscopeTraceability`,component:u,tags:[`autodocs`,`test`],args:{record:c}},v={play:async({canvasElement:e})=>{let t=g(e),n=t.getByRole(`button`,{name:`Voir la piste d’audit`});await h.click(n),await m(t.getByText(`Piste d’audit synthétique`)).toBeVisible(),await m(t.getByRole(`button`,{name:`Masquer la piste d’audit`})).toHaveAttribute(`aria-expanded`,`true`)}},y={args:{record:{scopeIdentifier:c.scopeIdentifier,procedureReference:c.procedureReference,cycleIdentifier:c.cycleIdentifier,operator:`IDE M. Sarr — identité synthétique`,leakTest:`not-recorded`,cleaning:`incomplete`,disinfection:`pending`,vigilanceAcknowledged:!1}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const audit = canvas.getByRole("button", {
      name: "Voir la piste d’audit"
    });
    await userEvent.click(audit);
    await expect(canvas.getByText("Piste d’audit synthétique")).toBeVisible();
    await expect(canvas.getByRole("button", {
      name: "Masquer la piste d’audit"
    })).toHaveAttribute("aria-expanded", "true");
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    record: {
      scopeIdentifier: syntheticTraceability.scopeIdentifier,
      procedureReference: syntheticTraceability.procedureReference,
      cycleIdentifier: syntheticTraceability.cycleIdentifier,
      operator: "IDE M. Sarr — identité synthétique",
      leakTest: "not-recorded",
      cleaning: "incomplete",
      disinfection: "pending",
      vigilanceAcknowledged: false
    }
  }
}`,...y.parameters?.docs?.source}}},b=[`Released`,`Incomplete`]})))()}x();export{y as Incomplete,v as Released,b as __namedExportsOrder,_ as default};