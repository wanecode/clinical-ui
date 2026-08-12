# Carte des domaines

Ce périmètre est un instantané de la profondeur métier implémentée dans ecoMed24 au 12 août 2026. Il
sert à concevoir les modules Clinical UI ; aucun code applicatif n'est importé.

| Package | Groupes structurants | Modules visuels phares |
| --- | --- | --- |
| `ophthalmology` | 9 groupes, 40 capacités | comparaison OD/OG, acuité-réfraction, glaucome, OCT/champ visuel, rétine, cornée, cataracte, orthoptie, urgences |
| `ent` | 9 groupes, 40 capacités | audiogramme, tympanométrie, endoscopie, vertiges, voix-déglutition, sommeil, oncologie, chirurgie, traçabilité des endoscopes |
| `odontology` | 9 groupes, 40 capacités | odontogramme par dent/face, parodonte à six sites, imagerie, plan phasé, endodontie, prothèse-implant, orthodontie, cycle documentaire |
| `dermatology` | 8 groupes, 40 capacités | carte corporelle, lésion longitudinale, dermoscopie, comparaison photographique, plaies, scores/surfaces, procédures, vigilances |
| `cardiology` | 9 groupes, 40 capacités | synthèse cardiovasculaire, ECG, échographie, MAPA/Holter, scores, trajectoires, prescriptions, implants, rapports |

Les identifiants et versions de `PlanDefinition` présents dans les goals conservent la traçabilité de
cet instantané. Toute règle clinique active exige malgré tout une validation locale versionnée.
