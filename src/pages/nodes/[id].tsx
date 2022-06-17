import { useRouter } from "next/router";

import Link from "next/link";
import styled from "styled-components";

import CloseLink from "../../components/shared/CloseLink";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

const NodesPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const renderCloseLink = () => {
    const onClose = () => {
      <Link href="/">
        <a></a>
      </Link>;
    };

    return <PositionedCloseLink {...{ onClick: onClose }} />;
  };

  // const renderNodeHeader = () => {
  //   const { feature, category, categories, parentCategory } = props;

  //   const statesWithIcon = ["edit-toilet-accessibility", "report"];
  //   const isModalStateWithPlaceIcon = includes(
  //     statesWithIcon,
  //     props.modalNodeState
  //   );
  //   const hasIcon = !props.modalNodeState || isModalStateWithPlaceIcon;

  //   return (
  //     <NodeHeader
  //       feature={feature}
  //       categories={categories}
  //       category={category}
  //       parentCategory={parentCategory}
  //       hasIcon={hasIcon}
  //     >
  //       {renderCloseLink()}
  //     </NodeHeader>
  //   );
  // };

  return <div>nodes page</div>;
};

export default NodesPage;
