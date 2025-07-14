import { useState } from "react";
import { useParams } from "react-router-dom";
import { input, labelClasses, formDiv } from "../../app/globalClasses";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import {
  useResetPasscodeMutation,
  useVerifySecurityNameMutation,
} from "./api/recoveryApi";

const Recovery = () => {
  const { recoveryUrl } = useParams<{ recoveryUrl: string }>();
  const [securityName, setSecurityName] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [step, setStep] = useState<"verify" | "reset">("verify");

  const [verifySecurityName] = useVerifySecurityNameMutation();
  const [resetPasscode] = useResetPasscodeMutation();

  const handleVerify = async () => {
    const serverRes = await verifySecurityName({
      slug: recoveryUrl ?? "",
      securityName,
    });

    if (serverRes?.data?.message === "Verified") {
      setStep("reset");
      toast.success("You are who you say you are.");
    }
  };

  const handleReset = async () => {
    await resetPasscode({ slug: recoveryUrl ?? "", newPasscode });
  };

  if (!recoveryUrl) return <p>Invalid recovery URL.</p>;

  return (
    <div className="w-full max-w-[600px] mx-auto py-10">
      <h2 className="text-xl font-semibold mb-4">Passcode Recovery</h2>

      {step === "verify" ? (
        <div className={formDiv}>
          <label className={labelClasses}>Security Name</label>
          <input
            className={input}
            value={securityName}
            onChange={(e) => setSecurityName(e.target.value)}
            placeholder="Enter your secret word"
          />
          <Button
            ariaLabel="Verify name"
            variant="PRIMARY"
            extraClasses="mt-4"
            onClick={handleVerify}
          >
            Verify
          </Button>
        </div>
      ) : (
        <div className={formDiv}>
          <label className={labelClasses}>New 6-digit Passcode</label>
          <input
            className={input}
            value={newPasscode}
            onChange={(e) => setNewPasscode(e.target.value)}
            placeholder="Enter new passcode"
          />
          <Button
            ariaLabel="Reset passcode"
            variant="PRIMARY"
            extraClasses="mt-4"
            onClick={handleReset}
          >
            Reset Passcode
          </Button>
        </div>
      )}
    </div>
  );
};

export default Recovery;
