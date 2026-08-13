import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{h as n}from"./iframe-CUdBhyno.js";import{a as r,i,o as a,r as o}from"./primitives-BGZVpAdQ.js";import{l as s,t as c}from"./fixtures-BtNEQcAc.js";function l({data:e,state:t=`ready`}){let[n,a]=(0,u.useState)(4),s=(0,u.useRef)([]),c=e.cells[n],l=(t,r)=>{let i=e.cells[n];if(!i)return;let o=Math.max(0,Math.min(2,i.row+t)),c=Math.max(0,Math.min(2,i.column+r)),l=e.cells.findIndex(e=>e.row===o&&e.column===c);l>=0&&(a(l),s.current[l]?.focus())};return(0,d.jsx)(o,{state:t,label:`Bilan orthoptique`,children:(0,d.jsxs)(`article`,{className:`oph-workbench oph-orthoptics`,children:[(0,d.jsxs)(`header`,{className:`oph-workbench-heading`,children:[(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`p`,{className:`oph-kicker`,children:`Pédiatrie & orthoptie`}),(0,d.jsx)(`h2`,{children:`Alignement en neuf positions`}),(0,d.jsx)(`p`,{children:`Motilité, stéréoscopie, amblyopie et coopération restent liées.`})]}),(0,d.jsx)(r,{})]}),(0,d.jsxs)(`div`,{className:`oph-orthoptics__summary`,children:[(0,d.jsxs)(`div`,{"data-cooperation":e.cooperation,children:[(0,d.jsx)(`span`,{children:`Coopération`}),(0,d.jsx)(`strong`,{children:f[e.cooperation]}),(0,d.jsx)(`small`,{children:e.cooperation===`variable`?`Interpréter les mesures répétées`:``})]}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`span`,{children:`Cover test loin`}),(0,d.jsx)(`strong`,{children:e.coverDistance})]}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`span`,{children:`Cover test près`}),(0,d.jsx)(`strong`,{children:e.coverNear})]}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`span`,{children:`Stéréoscopie`}),(0,d.jsx)(`strong`,{children:e.stereopsis})]})]}),(0,d.jsxs)(`div`,{className:`oph-orthoptics__layout`,children:[(0,d.jsxs)(i,{title:`Grille de motilité`,eyebrow:`Navigation au clavier`,children:[(0,d.jsx)(`p`,{className:`oph-help-text`,children:`Utilisez les quatre flèches pour explorer les neuf positions du regard.`}),(0,d.jsx)(`table`,{className:`oph-motility-grid`,"aria-label":`Motilité en neuf positions`,children:(0,d.jsx)(`tbody`,{children:[0,1,2].map(t=>(0,d.jsx)(`tr`,{children:e.cells.filter(e=>e.row===t).map(t=>{let r=e.cells.findIndex(e=>e.id===t.id);return(0,d.jsx)(`td`,{"data-finding":t.finding,"data-selected":n===r||void 0,children:(0,d.jsxs)(`button`,{ref:e=>{s.current[r]=e},type:`button`,"aria-pressed":n===r,onClick:()=>a(r),onKeyDown:e=>{e.key===`ArrowUp`&&(e.preventDefault(),l(-1,0)),e.key===`ArrowDown`&&(e.preventDefault(),l(1,0)),e.key===`ArrowLeft`&&(e.preventDefault(),l(0,-1)),e.key===`ArrowRight`&&(e.preventDefault(),l(0,1))},"aria-label":`${t.gaze}, ${t.value}, ${t.finding===`limited`?`limitation`:`normal`}`,children:[(0,d.jsx)(`span`,{"aria-hidden":`true`,className:`oph-eye-glyph`,children:`◉`}),(0,d.jsx)(`strong`,{children:t.value}),(0,d.jsx)(`small`,{children:t.gaze})]})},t.id)})},`motility-row-${t}`))})})]}),(0,d.jsxs)(i,{title:`Lecture sélectionnée`,eyebrow:`Position active`,children:[(0,d.jsxs)(`div`,{className:`oph-motility-inspector`,"aria-live":`polite`,children:[(0,d.jsx)(`span`,{className:`oph-eye-glyph`,"aria-hidden":`true`,children:`◉`}),(0,d.jsx)(`strong`,{children:c?.gaze}),(0,d.jsx)(`b`,{children:c?.value}),(0,d.jsx)(`small`,{children:c?.finding===`limited`?`△ Limitation documentée`:`✓ Motilité libre`})]}),(0,d.jsx)(`dl`,{className:`oph-metric-grid`,children:(0,d.jsxs)(`div`,{className:`oph-metric`,children:[(0,d.jsx)(`dt`,{children:`Risque amblyopie`}),(0,d.jsx)(`dd`,{children:(0,d.jsx)(`span`,{children:e.amblyopiaRisk})})]})})]})]}),(0,d.jsx)(`div`,{className:`oph-table-wrap`,children:(0,d.jsxs)(`table`,{className:`oph-table`,children:[(0,d.jsx)(`caption`,{children:`Alternative tabulaire de la motilité`}),(0,d.jsx)(`thead`,{children:(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`th`,{children:`Position`}),(0,d.jsx)(`th`,{children:`Mesure`}),(0,d.jsx)(`th`,{children:`Interprétation`})]})}),(0,d.jsx)(`tbody`,{children:e.cells.map(e=>(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`th`,{scope:`row`,children:e.gaze}),(0,d.jsx)(`td`,{children:e.value}),(0,d.jsx)(`td`,{children:e.finding===`limited`?`Limitation`:`Dans les limites`})]},e.id))})]})})]})})}var u,d,f;function p(){return(p=e((()=>{u=n(),a(),d=t(),f={good:`Bonne`,variable:`Variable`,"not-testable":`Non testable`},l.__docgenInfo={description:``,methods:[],displayName:`OrthopticsWorkbench`,props:{data:{required:!0,tsType:{name:`OrthopticsData`},description:``},state:{required:!1,tsType:{name:`union`,raw:`"ready" | "loading" | "empty" | "error" | "forbidden" | "partial"`,elements:[{name:`literal`,value:`"ready"`},{name:`literal`,value:`"loading"`},{name:`literal`,value:`"empty"`},{name:`literal`,value:`"error"`},{name:`literal`,value:`"forbidden"`},{name:`literal`,value:`"partial"`}]},description:``,defaultValue:{value:`"ready"`,computed:!1}}}}})))()}var m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{c(),p(),{expect:m,userEvent:h,within:g}=__STORYBOOK_MODULE_TEST__,_={title:`Ophthalmology/OrthopticsWorkbench`,component:l,tags:[`autodocs`,`test`],args:{data:s},parameters:{docs:{description:{component:`Grille de motilité navigable au clavier avec coopération, stéréoscopie et risque d’amblyopie.`}}}},v={},y={play:async({canvasElement:e})=>{let t=g(e),n=t.getByRole(`button`,{name:/Primaire · Centre/});n.focus(),await h.keyboard(`{ArrowRight}`),await m(t.getByRole(`button`,{name:/Primaire · Droite/})).toHaveAttribute(`aria-pressed`,`true`),await h.keyboard(`{ArrowUp}`),await m(t.getByRole(`button`,{name:/Haut · Droite/})).toHaveFocus(),await h.click(n),await m(n).toHaveAttribute(`aria-pressed`,`true`)}},b={args:{data:{...s,cooperation:`not-testable`,cells:s.cells.map(e=>({...e,value:`Non testé`,finding:`not-tested`}))}}},x={parameters:{viewport:{defaultViewport:`mobile1`}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const center = canvas.getByRole("button", {
      name: /Primaire · Centre/
    });
    center.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", {
      name: /Primaire · Droite/
    })).toHaveAttribute("aria-pressed", "true");
    await userEvent.keyboard("{ArrowUp}");
    await expect(canvas.getByRole("button", {
      name: /Haut · Droite/
    })).toHaveFocus();
    await userEvent.click(center);
    await expect(center).toHaveAttribute("aria-pressed", "true");
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    data: {
      ...syntheticOrthopticsData,
      cooperation: "not-testable",
      cells: syntheticOrthopticsData.cells.map(cell => ({
        ...cell,
        value: "Non testé",
        finding: "not-tested" as const
      }))
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  }
}`,...x.parameters?.docs?.source}}},S=[`Bilan`,`NavigationClavier`,`NonTestable`,`CompactMobile`]})))()}C();export{v as Bilan,x as CompactMobile,y as NavigationClavier,b as NonTestable,S as __namedExportsOrder,_ as default};