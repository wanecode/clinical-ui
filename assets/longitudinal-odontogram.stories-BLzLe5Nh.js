import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{h as n}from"./iframe-CUdBhyno.js";import{S as r,b as i,d as a,h as o,l as s,m as c,p as l,t as u,v as d,x as f,y as p}from"./fixtures-BmZn2avs.js";function m({teeth:e,dentition:t=`permanent`,selectedTooth:n,selectedSurface:i=`occlusal`,density:a=`comfortable`,historiesAvailable:s=!0,notation:u=`FDI`,entryConflict:m,onSelectionChange:y,state:b,stateMessage:x}){let S=(0,h.useMemo)(()=>e.filter(e=>t===`mixed`?!0:t===`primary`?e.dentition===`primary`:e.dentition===`permanent`),[t,e]),C=S.find(e=>e.fdi===n)?.fdi??S[0]?.fdi??``,[w,T]=(0,h.useState)(C),[E,D]=(0,h.useState)(i),O=(0,h.useRef)([]),k=S.find(e=>e.fdi===w)??S[0],A=(e,t=E)=>{T(e),D(t),y?.({tooth:e,surface:t})},j=(e,t)=>{let n=Math.max(1,Math.floor(S.length/2)),r=t;if(e.key===`ArrowRight`)r=Math.min(S.length-1,t+1);else if(e.key===`ArrowLeft`)r=Math.max(0,t-1);else if(e.key===`ArrowDown`)r=Math.min(S.length-1,t+n);else if(e.key===`ArrowUp`)r=Math.max(0,t-n);else if(e.key===`Home`)r=0;else if(e.key===`End`)r=S.length-1;else return;e.preventDefault();let i=S[r];i&&(A(i.fdi),O.current[r]?.focus())},M=(0,g.jsxs)(`div`,{className:`od-odontogram`,"data-density":a,children:[m?(0,g.jsxs)(`div`,{className:`od-conflict`,role:`alert`,children:[(0,g.jsx)(`span`,{"aria-hidden":`true`,children:`⚠`}),(0,g.jsxs)(`div`,{children:[(0,g.jsx)(`strong`,{children:`Conflit de saisie`}),(0,g.jsxs)(`p`,{children:[`Version locale · `,m.localAuthor,` à `,m.localTime,` — version distante · `,m.remoteAuthor,` à `,m.remoteTime]})]}),(0,g.jsx)(`button`,{type:`button`,children:`Comparer les versions`})]}):null,u===`FDI`?null:(0,g.jsxs)(`div`,{className:`od-notation-warning`,role:`status`,children:[(0,g.jsx)(`span`,{"aria-hidden":`true`,children:`?`}),(0,g.jsxs)(`div`,{children:[(0,g.jsx)(`strong`,{children:`Notation reçue non convertie`}),(0,g.jsxs)(`p`,{children:[`La notation « `,u,` » est conservée telle quelle. Confirmez la correspondance avant toute saisie.`]})]})]}),(0,g.jsxs)(`div`,{className:`od-odontogram__layout`,children:[(0,g.jsxs)(`div`,{className:`od-odontogram__chart`,children:[(0,g.jsx)(`section`,{className:`od-tooth-legend`,"aria-label":`Légende des états dentaires`,children:[`sound`,`caries`,`filled`,`crown`,`missing`,`implant`,`endodontic`].map(e=>(0,g.jsx)(p,{status:e},e))}),(0,g.jsxs)(`p`,{className:`od-scroll-hint`,children:[(0,g.jsx)(`span`,{"aria-hidden":`true`,children:`↔`}),` Faire défiler horizontalement sur écran étroit`]}),(0,g.jsxs)(`section`,{className:`od-laterality`,"aria-label":`Repères de latéralité, point de vue du patient`,children:[(0,g.jsx)(`span`,{children:`← Droit patient`}),(0,g.jsx)(`span`,{children:`Gauche patient →`})]}),(0,g.jsx)(`section`,{className:`od-arches`,"aria-label":`Odontogramme ${t} en notation FDI`,children:[`maxillary`,`mandibular`].map(e=>{let t=S.filter(t=>t.arch===e);return(0,g.jsxs)(`div`,{className:`od-arch`,children:[(0,g.jsx)(`span`,{className:`od-arch__label`,children:e===`maxillary`?`Maxillaire`:`Mandibule`}),(0,g.jsx)(`div`,{className:`od-arch__teeth`,children:t.map(e=>{let t=S.indexOf(e),n=r[e.status],i=e.fdi===k?.fdi;return(0,g.jsxs)(`button`,{type:`button`,className:`od-tooth`,"data-tooth-status":e.status,"data-selected":i||void 0,"aria-pressed":i,"aria-label":`${e.label} — ${f(e.fdi)} — ${n.label} — ${e.evidence}`,onClick:()=>A(e.fdi),onKeyDown:e=>j(e,t),ref:(e=>{O.current[t]=e}),tabIndex:i||!k&&t===0?0:-1,children:[(0,g.jsx)(`span`,{className:`od-tooth__fdi`,children:e.fdi}),(0,g.jsx)(`span`,{className:`od-tooth__shape`,"aria-hidden":`true`,children:(0,g.jsx)(`span`,{children:n.symbol})}),(0,g.jsx)(`span`,{className:`od-tooth__status`,children:n.label})]},e.fdi)})})]},e)})})]}),k?(0,g.jsxs)(`aside`,{className:`od-odontogram__inspector`,"aria-label":`Inspection de la dent ${k.fdi}`,children:[(0,g.jsx)(`p`,{className:`od-eyebrow`,children:`Unité longitudinale`}),(0,g.jsxs)(`h3`,{children:[`Dent `,k.fdi]}),(0,g.jsxs)(`div`,{className:`od-inspector-summary`,children:[(0,g.jsx)(p,{status:k.status}),(0,g.jsx)(o,{kind:k.evidence})]}),(0,g.jsxs)(`fieldset`,{className:`od-surface-picker`,children:[(0,g.jsx)(`legend`,{children:`Face sélectionnée`}),v.map(e=>(0,g.jsxs)(`button`,{type:`button`,"aria-pressed":E===e,onClick:()=>A(k.fdi,e),children:[(0,g.jsx)(`span`,{"aria-hidden":`true`,children:e===`occlusal`?`◎`:`◇`}),_[e]]},e))]}),(0,g.jsxs)(`div`,{className:`od-history`,children:[(0,g.jsxs)(`div`,{className:`od-history__heading`,children:[(0,g.jsx)(`h4`,{children:`Historique`}),(0,g.jsxs)(`span`,{children:[k.history?.length??0,` entrée(s)`]})]}),s?k.history?.length?(0,g.jsx)(`ol`,{children:k.history.map(e=>(0,g.jsxs)(`li`,{children:[(0,g.jsx)(`time`,{dateTime:e.date,children:e.date}),(0,g.jsx)(`strong`,{children:e.label}),e.detail?(0,g.jsx)(`span`,{children:e.detail}):null,(0,g.jsx)(o,{kind:e.evidence}),(0,g.jsx)(`code`,{children:e.resourceRef})]},e.id))}):(0,g.jsxs)(`div`,{className:`od-inline-empty`,role:`status`,children:[(0,g.jsx)(`strong`,{children:`Aucun événement longitudinal`}),(0,g.jsx)(`span`,{children:`La dent est connue, sans transition documentée.`})]}):(0,g.jsxs)(`div`,{className:`od-inline-empty`,role:`status`,children:[(0,g.jsx)(`strong`,{children:`Historique absent`}),(0,g.jsx)(`span`,{children:`Aucune version antérieure n'a été transmise.`})]})]})]}):null]}),(0,g.jsxs)(`details`,{className:`od-table-alternative`,children:[(0,g.jsx)(`summary`,{children:`Vue alternative — tableau dentaire`}),(0,g.jsx)(`div`,{className:`od-table-scroll`,children:(0,g.jsxs)(`table`,{children:[(0,g.jsx)(`caption`,{children:`État des dents affichées, équivalent textuel de l'odontogramme`}),(0,g.jsx)(`thead`,{children:(0,g.jsxs)(`tr`,{children:[(0,g.jsx)(`th`,{scope:`col`,children:`FDI`}),(0,g.jsx)(`th`,{scope:`col`,children:`Denture`}),(0,g.jsx)(`th`,{scope:`col`,children:`Arcade`}),(0,g.jsx)(`th`,{scope:`col`,children:`Latéralité`}),(0,g.jsx)(`th`,{scope:`col`,children:`État`}),(0,g.jsx)(`th`,{scope:`col`,children:`Provenance`}),(0,g.jsx)(`th`,{scope:`col`,children:`Ressource`})]})}),(0,g.jsx)(`tbody`,{children:S.map(e=>(0,g.jsxs)(`tr`,{"data-selected":e.fdi===k?.fdi||void 0,children:[(0,g.jsx)(`th`,{scope:`row`,children:e.fdi}),(0,g.jsx)(`td`,{children:e.dentition===`permanent`?`Permanente`:`Temporaire`}),(0,g.jsx)(`td`,{children:e.arch===`maxillary`?`Maxillaire`:`Mandibule`}),(0,g.jsx)(`td`,{children:f(e.fdi)}),(0,g.jsx)(`td`,{children:r[e.status].label}),(0,g.jsx)(`td`,{children:(0,g.jsx)(o,{kind:e.evidence})}),(0,g.jsx)(`td`,{children:(0,g.jsx)(`code`,{children:e.resourceRef})})]},e.fdi))})]})})]})]});return(0,g.jsx)(l,{eyebrow:`Parcours bucco-dentaire`,title:`Odontogramme longitudinal`,description:`La dent et la face restent sélectionnables, historisées et identifiables au clavier.`,actions:(0,g.jsx)(d,{}),className:`od-panel--odontogram`,children:(0,g.jsx)(c,{state:b,stateMessage:x,children:M})})}var h,g,_,v;function y(){return(y=e((()=>{h=n(),i(),g=t(),_={occlusal:`Occlusale`,mesial:`Mésiale`,distal:`Distale`,buccal:`Vestibulaire`,lingual:`Linguale / palatine`},v=Object.keys(_),m.__docgenInfo={description:``,methods:[],displayName:`LongitudinalOdontogram`,props:{state:{required:!1,tsType:{name:`union`,raw:`DentalUiState | undefined`,elements:[{name:`union`,raw:`"ready" | "loading" | "empty" | "error" | "forbidden"`,elements:[{name:`literal`,value:`"ready"`},{name:`literal`,value:`"loading"`},{name:`literal`,value:`"empty"`},{name:`literal`,value:`"error"`},{name:`literal`,value:`"forbidden"`}]},{name:`undefined`}]},description:``},stateMessage:{required:!1,tsType:{name:`union`,raw:`string | undefined`,elements:[{name:`string`},{name:`undefined`}]},description:``},teeth:{required:!0,tsType:{name:`Array`,elements:[{name:`ToothRecord`}],raw:`ToothRecord[]`},description:``},dentition:{required:!1,tsType:{name:`union`,raw:`"permanent" | "primary" | "mixed"`,elements:[{name:`literal`,value:`"permanent"`},{name:`literal`,value:`"primary"`},{name:`literal`,value:`"mixed"`}]},description:``,defaultValue:{value:`"permanent"`,computed:!1}},selectedTooth:{required:!1,tsType:{name:`string`},description:``},selectedSurface:{required:!1,tsType:{name:`union`,raw:`"occlusal" | "mesial" | "distal" | "buccal" | "lingual"`,elements:[{name:`literal`,value:`"occlusal"`},{name:`literal`,value:`"mesial"`},{name:`literal`,value:`"distal"`},{name:`literal`,value:`"buccal"`},{name:`literal`,value:`"lingual"`}]},description:``,defaultValue:{value:`"occlusal"`,computed:!1}},density:{required:!1,tsType:{name:`union`,raw:`"comfortable" | "compact"`,elements:[{name:`literal`,value:`"comfortable"`},{name:`literal`,value:`"compact"`}]},description:``,defaultValue:{value:`"comfortable"`,computed:!1}},historiesAvailable:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}},notation:{required:!1,tsType:{name:`union`,raw:`"FDI" | string`,elements:[{name:`literal`,value:`"FDI"`},{name:`string`}]},description:``,defaultValue:{value:`"FDI"`,computed:!1}},entryConflict:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  localAuthor: string;
  remoteAuthor: string;
  localTime: string;
  remoteTime: string;
}`,signature:{properties:[{key:`localAuthor`,value:{name:`string`,required:!0}},{key:`remoteAuthor`,value:{name:`string`,required:!0}},{key:`localTime`,value:{name:`string`,required:!0}},{key:`remoteTime`,value:{name:`string`,required:!0}}]}},description:``},onSelectionChange:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(selection: { tooth: string; surface: ToothSurface }) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{ tooth: string; surface: ToothSurface }`,signature:{properties:[{key:`tooth`,value:{name:`string`,required:!0}},{key:`surface`,value:{name:`union`,raw:`"occlusal" | "mesial" | "distal" | "buccal" | "lingual"`,elements:[{name:`literal`,value:`"occlusal"`},{name:`literal`,value:`"mesial"`},{name:`literal`,value:`"distal"`},{name:`literal`,value:`"buccal"`},{name:`literal`,value:`"lingual"`}],required:!0}}]}},name:`selection`}],return:{name:`void`}}},description:``}}}})))()}var b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R;function z(){return(z=e((()=>{u(),y(),{expect:b,userEvent:x,within:S}=__STORYBOOK_MODULE_TEST__,C=[...a,...s],w={title:`Odontology/LongitudinalOdontogram`,component:m,tags:[`autodocs`,`test`],args:{teeth:C,dentition:`permanent`,selectedTooth:`16`,selectedSurface:`occlusal`},argTypes:{dentition:{control:`inline-radio`,options:[`permanent`,`primary`,`mixed`]},density:{control:`inline-radio`,options:[`comfortable`,`compact`]},state:{control:`select`,options:[`ready`,`loading`,`empty`,`error`,`forbidden`]}},parameters:{docs:{description:{component:`Odontogramme FDI longitudinal accessible au clavier, avec sélection de face, états doublés par symbole et libellé, historique et alternative tabulaire.`}}}},T={play:async({canvasElement:e})=>{let t=S(e),n=t.getByRole(`button`,{name:/Dent permanente 16/});await b(n).toHaveAttribute(`aria-pressed`,`true`),await x.click(t.getByRole(`button`,{name:/Mésiale/})),await b(t.getByRole(`button`,{name:/Mésiale/})).toHaveAttribute(`aria-pressed`,`true`),await b(t.getByText(`Lésion carieuse occlusale`)).toBeVisible()}},E={play:async({canvasElement:e})=>{let t=S(e);t.getByRole(`button`,{name:/Dent permanente 16/}).focus(),await x.keyboard(`{ArrowRight}`),await b(t.getByRole(`button`,{name:/Dent permanente 15/})).toHaveAttribute(`aria-pressed`,`true`)}},D={args:{dentition:`primary`,selectedTooth:`64`}},O={args:{dentition:`mixed`,selectedTooth:`64`}},k={args:{density:`compact`}},A={parameters:{viewport:{defaultViewport:`mobile1`}}},j={args:{state:`loading`}},M={args:{state:`empty`}},N={args:{state:`error`}},P={args:{state:`forbidden`}},F={args:{historiesAvailable:!1}},I={args:{notation:`Universal / reçu : UR6`}},L={args:{entryConflict:{localAuthor:`Dr M. Ba`,remoteAuthor:`Dr S. Kane`,localTime:`10:24`,remoteTime:`10:25`}},play:async({canvasElement:e})=>{let t=S(e);await b(t.getByRole(`alert`)).toHaveTextContent(`Conflit de saisie`),await x.click(t.getByRole(`button`,{name:`Comparer les versions`}))}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const tooth = canvas.getByRole("button", {
      name: /Dent permanente 16/
    });
    await expect(tooth).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(canvas.getByRole("button", {
      name: /Mésiale/
    }));
    await expect(canvas.getByRole("button", {
      name: /Mésiale/
    })).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByText("Lésion carieuse occlusale")).toBeVisible();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const tooth16 = canvas.getByRole("button", {
      name: /Dent permanente 16/
    });
    tooth16.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", {
      name: /Dent permanente 15/
    })).toHaveAttribute("aria-pressed", "true");
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    dentition: "primary",
    selectedTooth: "64"
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    dentition: "mixed",
    selectedTooth: "64"
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    density: "compact"
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    state: "loading"
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    state: "empty"
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    state: "error"
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    state: "forbidden"
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    historiesAvailable: false
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    notation: "Universal / reçu : UR6"
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    entryConflict: {
      localAuthor: "Dr M. Ba",
      remoteAuthor: "Dr S. Kane",
      localTime: "10:24",
      remoteTime: "10:25"
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent("Conflit de saisie");
    await userEvent.click(canvas.getByRole("button", {
      name: "Comparer les versions"
    }));
  }
}`,...L.parameters?.docs?.source}}},R=[`PermanentDentition`,`KeyboardNavigation`,`PrimaryDentition`,`MixedDentition`,`CompactDesktop`,`MobileHorizontalScroll`,`Loading`,`Empty`,`DataError`,`Forbidden`,`HistoryAbsent`,`UnsupportedNotation`,`EntryConflict`]})))()}z();export{k as CompactDesktop,N as DataError,M as Empty,L as EntryConflict,P as Forbidden,F as HistoryAbsent,E as KeyboardNavigation,j as Loading,O as MixedDentition,A as MobileHorizontalScroll,T as PermanentDentition,D as PrimaryDentition,I as UnsupportedNotation,R as __namedExportsOrder,w as default};