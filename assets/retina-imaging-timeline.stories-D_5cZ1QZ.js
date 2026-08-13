import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{d as t,f as n,t as r}from"./fixtures-BtNEQcAc.js";import{n as i,t as a}from"./retina-imaging-timeline-ZQN62W28.js";var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{r(),i(),{expect:o,userEvent:s,within:c}=__STORYBOOK_MODULE_TEST__,l={"oct-2026-od":new URL(``+new URL(`oct-od-current-synthetic-my6DMa4S.png`,import.meta.url).href,``+import.meta.url).href,"oct-2026-og":new URL(``+new URL(`oct-og-current-low-signal-synthetic-CgnXD-Og.png`,import.meta.url).href,``+import.meta.url).href,"oct-2025-od":new URL(``+new URL(`oct-od-prior-synthetic-BeC1jLOt.png`,import.meta.url).href,``+import.meta.url).href},u=n.map(e=>{let t=l[e.id];return t?{...e,imageUrl:t,imageAlt:e.id===`oct-2026-og`?`OCT synthétique ${e.eye} du ${e.date}, signal réduit et artéfact de mouvement simulé`:`OCT synthétique ${e.eye} du ${e.date}, coupe maculaire simulée`}:e}),d={title:`Ophthalmology/RetinaImagingTimeline`,component:a,tags:[`autodocs`,`test`],args:{images:u,careEvents:t},parameters:{docs:{description:{component:`Comparateur OCT/fundus synthétique avec qualité, indisponibilité et provenance toujours visibles.`}}}},f={},p={play:async({canvasElement:e})=>{let t=c(e),n=t.getAllByRole(`option`),r=n.at(0);if(!r)throw Error(`Premier examen d’imagerie introuvable`);r.focus(),await s.keyboard(`{ArrowRight}`);let i=n.at(1);if(!i)throw Error(`Deuxième examen d’imagerie introuvable`);await o(i).toHaveAttribute(`aria-selected`,`true`),await s.click(t.getByRole(`button`,{name:`Afficher la liste accessible`})),await o(t.getByRole(`table`,{name:`Inventaire d’imagerie synthétique`})).toBeVisible(),await s.click(t.getByRole(`button`,{name:`Masquer la liste accessible`})),i.focus(),await s.keyboard(`{Home}`),await o(r).toHaveAttribute(`aria-selected`,`true`)}},m={args:{initialImageId:`oct-2026-og`}},h={args:{initialImageId:`fundus-2025-og`}},g={args:{state:`partial`,images:u.map((e,t)=>t===0?{...e,source:`Source non résolue`}:e)}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const options = canvas.getAllByRole("option");
    const firstOption = options.at(0);
    if (!firstOption) throw new Error("Premier examen d’imagerie introuvable");
    firstOption.focus();
    await userEvent.keyboard("{ArrowRight}");
    const secondOption = options.at(1);
    if (!secondOption) throw new Error("Deuxième examen d’imagerie introuvable");
    await expect(secondOption).toHaveAttribute("aria-selected", "true");
    await userEvent.click(canvas.getByRole("button", {
      name: "Afficher la liste accessible"
    }));
    await expect(canvas.getByRole("table", {
      name: "Inventaire d’imagerie synthétique"
    })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", {
      name: "Masquer la liste accessible"
    }));
    secondOption.focus();
    await userEvent.keyboard("{Home}");
    await expect(firstOption).toHaveAttribute("aria-selected", "true");
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    initialImageId: "oct-2026-og"
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    initialImageId: "fundus-2025-og"
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    state: "partial",
    images: storyRetinaImages.map((image, index) => index === 0 ? {
      ...image,
      source: "Source non résolue"
    } : image)
  }
}`,...g.parameters?.docs?.source}}},_=[`Comparaison`,`NavigationClavierEtTable`,`QualiteInsuffisante`,`Indisponible`,`ProvenancePartielle`]})))()}v();export{f as Comparaison,h as Indisponible,p as NavigationClavierEtTable,g as ProvenancePartielle,m as QualiteInsuffisante,_ as __namedExportsOrder,d as default};