import { Image, useTheme, View } from "@aws-amplify/ui-react";
import logo from "../../assets/labelLogo.svg";

export const components = {
  Header() {
    const { tokens } = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image
          alt="Logo"
          src={logo}
          width={120}
          transform={"rotate(0.05turn)"}
        />
      </View>
    );
  },
};
