import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,t as n}from"./fixtures-BtNEQcAc.js";import{n as r,t as i}from"./glaucoma-progression-workbench-CN5dcWE8.js";var a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),r(),{expect:a,userEvent:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`Ophthalmology/GlaucomaProgressionWorkbench`,component:i,tags:[`autodocs`,`test`],args:{data:t},parameters:{docs:{description:{component:`PIO, RNFL et champ visuel avec projections en tirets explicitement non observées.`}}}},l={},u={play:async({canvasElement:e})=>{let t=s(e),n=t.getAllByRole(`button`,{name:/OD.*mmHg.*Observé/}).at(0);if(!n)throw Error(`Point de trajectoire OD introuvable`);n.focus(),await o.keyboard(`{ArrowRight}`),await a(t.getAllByRole(`button`,{pressed:!0}).length).toBeGreaterThan(0);let r=t.getAllByRole(`button`,{name:`Afficher l’alternative tabulaire`}).at(0);if(!r)throw Error(`Commande d’alternative tabulaire introuvable`);await o.click(r),await a(t.getByRole(`table`,{name:`Évolution de la pression intraoculaire — valeurs de la courbe`})).toBeVisible();let i=t.getAllByRole(`button`,{name:`Masquer l’alternative tabulaire`}).at(0);if(!i)throw Error(`Commande de fermeture tabulaire introuvable`);await o.click(i),n.focus(),await o.keyboard(`{Home}`),await a(n).toHaveAttribute(`aria-pressed`,`true`)}},d={args:{state:`partial`,data:{...t,visualField:t.visualField.slice(0,1)}}},f={args:{data:{...t,iop:t.iop.filter(e=>e.kind!==`projected`),rnfl:t.rnfl.filter(e=>e.kind!==`projected`)}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const firstPoint = canvas.getAllByRole("button", {
      name: /OD.*mmHg.*Observé/
    }).at(0);
    if (!firstPoint) throw new Error("Point de trajectoire OD introuvable");
    firstPoint.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getAllByRole("button", {
      pressed: true
    }).length).toBeGreaterThan(0);
    const tableToggle = canvas.getAllByRole("button", {
      name: "Afficher l’alternative tabulaire"
    }).at(0);
    if (!tableToggle) throw new Error("Commande d’alternative tabulaire introuvable");
    await userEvent.click(tableToggle);
    await expect(canvas.getByRole("table", {
      name: "Évolution de la pression intraoculaire — valeurs de la courbe"
    })).toBeVisible();
    const tableHide = canvas.getAllByRole("button", {
      name: "Masquer l’alternative tabulaire"
    }).at(0);
    if (!tableHide) throw new Error("Commande de fermeture tabulaire introuvable");
    await userEvent.click(tableHide);
    firstPoint.focus();
    await userEvent.keyboard("{Home}");
    await expect(firstPoint).toHaveAttribute("aria-pressed", "true");
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    state: "partial",
    data: {
      ...syntheticGlaucomaData,
      visualField: syntheticGlaucomaData.visualField.slice(0, 1)
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    data: {
      ...syntheticGlaucomaData,
      iop: syntheticGlaucomaData.iop.filter(point => point.kind !== "projected"),
      rnfl: syntheticGlaucomaData.rnfl.filter(point => point.kind !== "projected")
    }
  }
}`,...f.parameters?.docs?.source}}},p=[`Progression`,`NavigationClavierEtTable`,`PreliminaireEtPartiel`,`SansProjection`]})))()}m();export{u as NavigationClavierEtTable,d as PreliminaireEtPartiel,l as Progression,f as SansProjection,p as __namedExportsOrder,c as default};