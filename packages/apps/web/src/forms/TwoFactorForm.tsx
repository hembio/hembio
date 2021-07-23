import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles";
import { makeStyles, createStyles } from "@material-ui/styles";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useStores } from "../stores";

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      form: {
        width: "100%",
        marginTop: theme.spacing(1),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
      },
      digit: {
        fontSize: "48px",
        padding: "4px 10px",
      },
    }),
  {
    name: "SignInForm",
  },
);

export const TwoFactorForm = observer(() => {
  const { authStore } = useStores();
  const classes = useStyles();
  const submitBtn = useRef<HTMLButtonElement>(null);
  const [tfaCode, setTfaCode] = useState<Array<string>>(new Array(6).fill(""));
  const focusIndex = tfaCode.indexOf("");

  useEffect(() => {
    console.log(focusIndex);
    if (focusIndex === -1 && submitBtn.current) {
      submitBtn.current.focus();
      return;
    } else {
      const nextFocusItem = document.getElementById(`digit-${focusIndex + 1}`);
      if (nextFocusItem) {
        nextFocusItem.focus();
      }
    }
  }, [tfaCode]);

  return (
    <form
      className={classes.form}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        authStore.twoFactor(tfaCode.join(""));
      }}
    >
      <Typography variant="h6" color="body1" align="center">
        Two-Factor Authentication
      </Typography>
      <Typography
        variant="subtitle2"
        color="body1"
        align="center"
        sx={{ mb: 2, opacity: 0.5 }}
      >
        Enter the 6-digit code shown in your 2FA app.
      </Typography>
      {tfaCode.map((code, idx) => (
        <TextField
          key={`digit-${idx + 1}`}
          variant="filled"
          id={`digit-${idx + 1}`}
          // label={`digit-${idx + 1}`}
          name={`digit-${idx + 1}`}
          autoFocus={idx === 0}
          focused={focusIndex === idx}
          InputProps={{
            classes: {
              input: classes.digit,
            },
          }}
          sx={{ width: "48px", p: 0, mr: idx < 5 ? 1 : 0 }}
          value={code}
          onChange={(e) => {
            tfaCode.splice(idx, 1, e.target.value);
            setTfaCode([...tfaCode]);
          }}
        />
      ))}
      <Button
        ref={submitBtn}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Authenticate
      </Button>
    </form>
  );
});
