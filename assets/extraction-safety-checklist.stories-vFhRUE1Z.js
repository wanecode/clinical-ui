import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{h as n}from"./iframe-CUdBhyno.js";import{b as r,m as i,o as a,p as o,t as s,v as c}from"./fixtures-BmZn2avs.js";function l({tooth:e,items:t,onCompletionChange:n,state:r,stateMessage:a}){let[s,l]=(0,u.useState)(()=>new Set(t.filter(e=>e.checked).map(e=>e.id))),f=t.filter(e=>!s.has(e.id)),p=f.filter(e=>e.critical),m=e=>{let r=new Set(s);r.has(e)?r.delete(e):r.add(e),l(r),n?.(r.size===t.length,Array.from(r))};return(0,d.jsx)(o,{eyebrow:`Extraction · dent ${e}`,title:`Sécurité avant extraction`,description:`Les points critiques bloquent la validation tant qu'ils ne sont pas explicitement confirmés.`,actions:(0,d.jsx)(c,{}),className:`od-panel--safety`,children:(0,d.jsxs)(i,{state:r,stateMessage:a,children:[(0,d.jsxs)(`div`,{className:`od-safety-status`,"data-complete":f.length===0||void 0,role:p.length?`alert`:`status`,children:[(0,d.jsx)(`span`,{"aria-hidden":`true`,children:f.length===0?`✓`:`!`}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`strong`,{children:f.length===0?`Checklist complète`:`Checklist incomplète`}),(0,d.jsx)(`p`,{children:f.length===0?`Tous les contrôles sont documentés.`:`${f.length} contrôle(s) restant(s), dont ${p.length} critique(s).`})]})]}),(0,d.jsxs)(`fieldset`,{className:`od-safety-list`,children:[(0,d.jsx)(`legend`,{children:`Contrôles documentés`}),t.map(e=>(0,d.jsxs)(`label`,{"data-critical":e.critical||void 0,children:[(0,d.jsx)(`input`,{type:`checkbox`,checked:s.has(e.id),onChange:()=>m(e.id)}),(0,d.jsx)(`span`,{className:`od-safety-checkbox`,"aria-hidden":`true`,children:s.has(e.id)?`✓`:``}),(0,d.jsxs)(`span`,{children:[(0,d.jsx)(`strong`,{children:e.label}),e.detail?(0,d.jsx)(`small`,{children:e.detail}):null,(0,d.jsx)(`code`,{children:e.resourceRef})]}),e.critical?(0,d.jsx)(`em`,{children:`Critique`}):null]},e.id))]}),(0,d.jsx)(`button`,{className:`od-primary-action`,type:`button`,disabled:f.length>0,children:`Valider la sécurité préopératoire`})]})})}var u,d;function f(){return(f=e((()=>{u=n(),r(),d=t(),l.__docgenInfo={description:``,methods:[],displayName:`ExtractionSafetyChecklist`,props:{state:{required:!1,tsType:{name:`union`,raw:`DentalUiState | undefined`,elements:[{name:`union`,raw:`"ready" | "loading" | "empty" | "error" | "forbidden"`,elements:[{name:`literal`,value:`"ready"`},{name:`literal`,value:`"loading"`},{name:`literal`,value:`"empty"`},{name:`literal`,value:`"error"`},{name:`literal`,value:`"forbidden"`}]},{name:`undefined`}]},description:``},stateMessage:{required:!1,tsType:{name:`union`,raw:`string | undefined`,elements:[{name:`string`},{name:`undefined`}]},description:``},tooth:{required:!0,tsType:{name:`string`},description:``},items:{required:!0,tsType:{name:`Array`,elements:[{name:`SafetyItem`}],raw:`SafetyItem[]`},description:``},onCompletionChange:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(complete: boolean, checkedIds: string[]) => void`,signature:{arguments:[{type:{name:`boolean`},name:`complete`},{type:{name:`Array`,elements:[{name:`string`}],raw:`string[]`},name:`checkedIds`}],return:{name:`void`}}},description:``}}}})))()}var p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{f(),s(),{expect:p,userEvent:m,within:h}=__STORYBOOK_MODULE_TEST__,g={title:`Odontology/ExtractionSafetyChecklist`,component:l,tags:[`autodocs`,`test`],args:{tooth:`36`,items:a},parameters:{docs:{description:{component:`Checklist préopératoire interactive : les contrôles critiques non documentés empêchent la validation.`}}}},_={play:async({canvasElement:e})=>{let t=h(e),n=t.getByRole(`checkbox`,{name:/Consentement éclairé obtenu/}),r=t.getByRole(`checkbox`,{name:/Plan d'hémostase prêt/}),i=t.getByRole(`button`,{name:`Valider la sécurité préopératoire`});await p(i).toBeDisabled(),await m.click(n),await m.click(r),await p(i).toBeEnabled(),await p(t.getByText(`Checklist complète`)).toBeVisible()}},v={args:{items:a.map(e=>({...e,checked:!0}))}},y={args:{state:`forbidden`}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const consent = canvas.getByRole("checkbox", {
      name: /Consentement éclairé obtenu/
    });
    const hemostasis = canvas.getByRole("checkbox", {
      name: /Plan d'hémostase prêt/
    });
    const action = canvas.getByRole("button", {
      name: "Valider la sécurité préopératoire"
    });
    await expect(action).toBeDisabled();
    await userEvent.click(consent);
    await userEvent.click(hemostasis);
    await expect(action).toBeEnabled();
    await expect(canvas.getByText("Checklist complète")).toBeVisible();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    items: syntheticExtractionSafetyItems.map(item => ({
      ...item,
      checked: true
    }))
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    state: "forbidden"
  }
}`,...y.parameters?.docs?.source}}},b=[`IncompleteCriticalGate`,`Complete`,`Forbidden`]})))()}x();export{v as Complete,y as Forbidden,_ as IncompleteCriticalGate,b as __namedExportsOrder,g as default};