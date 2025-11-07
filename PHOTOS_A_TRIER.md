# Photos à trier - État actuel

Date: 2025-11-07
Par: Lalou
Dossier: /public/images/works/a-trier/

---

## ÉTAT ACTUEL

**Dossier vide** : Aucune photo en attente de tri.

```bash
ls -lh public/images/works/a-trier/
# total 0
```

---

## FONCTIONNEMENT

Quand Guillaume upload photos via interface admin:
1. Photos sauvegardées dans `/public/images/works/a-trier/`
2. Metadata créé avec `status: 'to-sort'`
3. Guillaume catégorise ensuite (unlimited/limited/xxl/monumental)
4. Photos déplacées vers dossier final (/public/images/works/empreintes/, etc.)

---

## COMMANDE MONITORING

Pour voir photos en attente:

```bash
ls -lh public/images/works/a-trier/
```

Ou avec détails:

```bash
find public/images/works/a-trier/ -type f -exec ls -lh {} \; | awk '{print $9, "("$5")"}'
```

---

## VOLUME ESTIMÉ FUTUR

Guillaume mentionne upload fréquent de photos.

Estimation: 10-50 photos/semaine à trier.

---

Lalou
