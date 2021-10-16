import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = {
  card: {
    maxWidth: 345,
    marginRight: 20,
    marginBottom: 20,
  },
  media: {
    height: 140,
  },
};

function TopicCard({
  topic,
  isSubscribed,
  classes,
  onSubscribe,
  onUnsubscribe,
}) {
  if (!topic) return;
  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {topic.topicName}
          </Typography>
          <Typography component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {isSubscribed ? (
          <Button size="small" color="secondary" onClick={onUnsubscribe}>
            Unsubscribe
          </Button>
        ) : (
          <Button size="small" color="primary" onClick={onSubscribe}>
            Subscribe
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

TopicCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopicCard);
