# AsimovGestion 1

AsimovGestion est un logiciel directement dans le navigateur qui permet de faciliter la gestion des élèves & notes au sein d'un lycée/collège.  

## Installation

Vous pouvez installer AsimovGestion directement depuis votre terminal, sont nécessaires à son fonctionnement :
   - Un serveur MySQL **allumé**
      - Note : le type de serveur requis est MariaDB, en version recommandée 10.3.\*, des erreurs peuvent survenir en cas de non respect de cette condition.
   - Le gestionnaire de paquets **NPM**
   - **Node.js**

```bash
git clone git://github.com/Oskar-Ardolo/asimov asimovproject/
npm install
node index.js
```  

## Usage

Il existe 3 rôles différents dans l'application (Administrateur, Professeur et élève) voici donc les identifiants de 3 de ces comptes :

**Administrateur**
```bash
pseudo : oldfieldgraham
mdp : oldfield-graham
```
**Professeur**
```bash
pseudo : roumaneda
mdp : ROUMANET-David
```
**Elève**
```bash
pseudo : ayedme
mdp : AYED-Merwann
```
## Contributions
Les pull requests sont les bienvenues ! Pour les gros changements (majeurs), merci d'ouvrir un ticket dans *Issues* afin de discuter des ajouts que vous souhaitez apporter.  

## Credits
[StartBootstrap](https://startbootstrap.com/) - Thème  
ROUILLARD Meltz Vincent - **Main Developper**  
FONTANA Enzo - **Main Developper** / **Graphist**    

## License
[MIT](https://choosealicense.com/licenses/mit/)
