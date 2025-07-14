
import { EditScreen } from '../edit/EditScreen'; // EditScreen にフォームとテーブルのロジックが含まれている場合

export const EditRequestContent: React.FC = () => {

  return (
    <div className="space-y-8">
      <EditScreen /> {/* EditScreen がフォームとテーブルのロジックを内包していると仮定 */}
      {/*
      <EditRequestForm />
      <EditRequestTable />
      */}
    </div>
  );
};
