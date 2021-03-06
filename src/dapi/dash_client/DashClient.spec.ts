import o from 'ospec';
import contracts from "./Contracts";
import {makeClient} from "./DashClient";
import {Platform} from "dash/dist/src/SDK/Client/Platform";

o.spec("Contracts", async function () {
  o.specTimeout(25000);
  o("Contracts are deployed and match format", function () {
    const client = makeClient(null);
    const retrieveContract = async (id: string, platform: Platform) =>  platform.contracts.get(id);
    let threw : unknown = false;
    return Promise.all(Object.entries(contracts)
      .map(entry => {
        const [k, v] = entry;
        const id = contracts[k]?.contractId;
        const format = contracts[k]?.contractFormat;
        return client.platform == null || id == null
          ? Promise.reject("no platform")
          : retrieveContract(id, client.platform)
          .then(retrievedContract => {
            if(retrievedContract == null) return Promise.reject("missing " + k + " at id " + v.contractId);
            o(retrievedContract.documents).deepEquals(format);
            return null;
          })
          .catch(e => threw = e.message)
          .then(() => client.disconnect())
          .then(() => o(threw).equals(false));
      }));
  });
});
