"use client";

import { useState } from "react";

import { BookingInputStep } from "@/components/reserve/booking-input-step";
import { CompleteStep } from "@/components/reserve/complete-step";
import { ConfirmStep } from "@/components/reserve/confirm-step";
import { ProgressSteps, type ReserveStep } from "@/components/reserve/progress-steps";
import { RequireLogin } from "@/components/mypage/require-login";
import type { DemoUser } from "@/lib/auth-context";
import { formatJpDate, offeredSlots, type SlotId } from "@/lib/availability";
import type { FacilityDetail } from "@/lib/demo-data";
import { useNotifications } from "@/lib/notifications";
import { demoOrganizations, getOrganization } from "@/lib/organization";
import {
  generateLotteryId,
  generateReservationId,
  requiresLottery,
  SLOT_LABELS,
  type ReservationDraft,
} from "@/lib/reservation-flow";

/** 予約申請〜抽選〜完了フローの本体。未ログインなら RequireLogin がログイン画面へ誘導する */
export function ReserveFlowClient({
  facility,
  date,
  initialSlotId,
}: {
  facility: FacilityDetail;
  date: Date;
  initialSlotId?: SlotId;
}) {
  return (
    <RequireLogin redirectTo={`/reserve/${facility.slug}`}>
      {(user) => (
        <ReserveFlowInner facility={facility} date={date} initialSlotId={initialSlotId} user={user} />
      )}
    </RequireLogin>
  );
}

function ReserveFlowInner({
  facility,
  date,
  initialSlotId,
  user,
}: {
  facility: FacilityDetail;
  date: Date;
  initialSlotId?: SlotId;
  user: DemoUser;
}) {
  const isLottery = requiresLottery(date);
  const offered = offeredSlots(date);
  const { addNotification } = useNotifications();

  const [step, setStep] = useState<ReserveStep>("input");
  const [submitting, setSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ReservationDraft>({
    slotId: initialSlotId ?? offered[0] ?? "am",
    phone: user.tel,
    organizationId: null,
    purpose: "",
    participants: 1,
    equipment: [],
    remarks: "",
    paymentMethod: "counter",
  });

  const organization = draft.organizationId ? getOrganization(draft.organizationId) ?? null : null;

  function updateDraft(patch: Partial<ReservationDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  async function handleConfirm() {
    setSubmitting(true);
    // デモのため実際の予約・抽選処理は行わない。疑似的な処理待ちだけ挟む
    await new Promise((resolve) => setTimeout(resolve, 900));
    setReferenceId(isLottery ? generateLotteryId(date) : generateReservationId(date));
    setSubmitting(false);
    setStep("complete");

    // ヘッダーの通知ベルに「完了したこと」を反映する（開発方針 §0 のためページ再読込で消える）
    addNotification({
      kind: isLottery ? "lottery-applied" : "reservation",
      title: isLottery ? "抽選に申し込みました" : "予約が完了しました",
      detail: `${facility.name}（${SLOT_LABELS[draft.slotId]}） ${formatJpDate(date)}`,
      date: "たった今",
      href: isLottery ? "/mypage/lottery" : "/mypage/reservations",
    });
  }

  return (
    <div>
      <ProgressSteps current={step} />

      {step === "input" ? (
        <BookingInputStep
          facility={facility}
          date={date}
          isLottery={isLottery}
          draft={draft}
          onChange={updateDraft}
          user={user}
          organizations={demoOrganizations}
          onSubmit={() => setStep("confirm")}
        />
      ) : null}

      {step === "confirm" ? (
        <ConfirmStep
          facility={facility}
          date={date}
          draft={draft}
          onDraftChange={updateDraft}
          user={user}
          organization={organization}
          isLottery={isLottery}
          submitting={submitting}
          onBack={() => setStep("input")}
          onConfirm={handleConfirm}
        />
      ) : null}

      {step === "complete" && referenceId ? (
        <CompleteStep
          facility={facility}
          date={date}
          draft={draft}
          organization={organization}
          isLottery={isLottery}
          referenceId={referenceId}
        />
      ) : null}
    </div>
  );
}
