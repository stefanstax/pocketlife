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

  const [verifySecurityName, { isLoading: verifying }] =
    useVerifySecurityNameMutation();
  const [resetPasscode, { isLoading: resetting }] = useResetPasscodeMutation();

  const handleVerify = async () => {
    const serverRes = await verifySecurityName({
      slug: recoveryUrl ?? "",
      securityName,
    });

    if (serverRes?.data?.message === "Verified") {
      setStep("reset");
      toast.success("Wow, look at that, it's correct.");
    } else {
      toast.error("Security name is not correct");
    }
  };

  const handleReset = async () => {
    if (newPasscode?.length < 6 || newPasscode?.length > 6) {
      toast.error("Passcode must be a 6 digits.");
      return;
    }
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
            {verifying ? "Verifying..." : "Verify"}
          </Button>
        </div>
      ) : (
        <div className={formDiv}>
          <label className={labelClasses}>New 6-digit Passcode</label>
          <input
            type="password"
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
            {resetting ? "Resetting..." : "Reset Passcode"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Recovery;
