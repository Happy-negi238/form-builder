import { useEffect, useState } from "react";
import { getFingerprint } from "~/lib/fingerprint";

export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string>("");
  useEffect(() => {
    const fetchFingerprint = async () => {
      const fp = await getFingerprint();
      setFingerprint(fp);
    };
    fetchFingerprint();
  }, []);

  return fingerprint;
};
